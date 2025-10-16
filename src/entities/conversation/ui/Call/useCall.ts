import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../../shared/utils/useSocket";
import { apiURLs } from "../../../../shared/values/strValues";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import {
  resetCallState,
  selectCallEndReason,
  selectCallStatus,
  selectCallTo,
  selectInterlocuter,
  selectMediaState,
  setCallEndReason,
  setCallFrom,
  setCallStatus,
  setInterlocuter,
  setMediaState,
} from "../../model/callSlice";
import { selectCurrentUser } from "../../../user";
import { rtcConfig } from "../../../../shared/utils/rtcConfig";
import {
  TCallParticipant,
  TCallStatus,
  TMediaState,
} from "../../api/callTypes";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;
type TCallStateRef = {
  interlocuter: TCallParticipant | null;
  callStatus: TCallStatus;
  callTo: string | null;
  sdp: RTCSessionDescriptionInit | null;
  peerConnection: RTCPeerConnection | null;
  currentUser: TUserInfo | null;
};
const useCall = () => {
  const dispatch = useAppDispatch();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const callTo = useAppSelector(selectCallTo);
  const currentUser = useAppSelector(selectCurrentUser);
  const callStatus = useAppSelector(selectCallStatus);
  const endCallReason = useAppSelector(selectCallEndReason);
  const interlocuter = useAppSelector(selectInterlocuter);
  const mediaState = useAppSelector(selectMediaState);

  const callsSocket = useSocket(wsUrl);
  // REFS for states because of stale closure
  const callStateRef = useRef<TCallStateRef>({
    interlocuter: interlocuter,
    currentUser: null,
    callStatus: callStatus,
    callTo: callTo,
    sdp: null,
    peerConnection: null,
  });
  useEffect(() => {
    callStateRef.current.currentUser = currentUser;
  }, [currentUser]);
  useEffect(() => {
    callStateRef.current.callStatus = callStatus;
  }, [callStatus]);
  useEffect(() => {
    callStateRef.current.interlocuter = interlocuter;
  }, [interlocuter]);
  useEffect(() => {
    callStateRef.current.callTo = callTo;
  }, [callTo]);

  useEffect(() => {
    callsSocket.emit("joinCallsSocket");

    callsSocket.on("iceCandidate", ({ candidate }) => {
      callStateRef.current?.peerConnection?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });
    callsSocket.on("mediaStateChanged", ({ from, mediaState }) => {
      if (callStateRef.current?.interlocuter?._id !== from._id) return;

      dispatch(
        setInterlocuter({ ...callStateRef.current.interlocuter, ...mediaState })
      );
    });
    callsSocket.on("incomingCall", ({ sdp, from }) => {
      if (callStatus !== "idle") {
        callsSocket.emit("endCall", {
          callWith: from._id,
        });
        return;
      }

      callStateRef.current.sdp = sdp;
      dispatch(setCallFrom(from._id));
      dispatch(setInterlocuter(from));
      dispatch(setCallStatus("incoming"));
    });
    callsSocket.on("callAccepted", ({ sdp, from }) => {
      if (
        callStateRef.current.callStatus === "outgoing" &&
        callStateRef.current.callTo === from._id
      ) {
        dispatch(setCallStatus("active"));
        // if (callStateRef.current.isRemoteSdpSet) {
        //   return;
        // }
        // callStateRef.current.isRemoteSdpSet = true;
        callStateRef.current?.peerConnection?.setRemoteDescription(sdp);
      }
    });
    callsSocket.on("callEnded", () => {
      dispatch(setCallEndReason("interlocuter"));

      dispatch(setCallStatus("ended"));
    });
    callsSocket.on("newSdp", ({ sdp, from, sdpType }) => {
      if (callStateRef.current.interlocuter?._id === from._id) {
        callStateRef.current?.peerConnection?.setRemoteDescription(sdp);

        if (sdpType === "offer") {
          sendSdp("answer");
        }
      }
    });
    return () => {
      callsSocket.off("newSdp");
      callsSocket.off("callEnded");
      callsSocket.off("callAccepted");
      callsSocket.off("incomingCall");
      callsSocket.off("mediaStateChanged");
      callsSocket.off("iceCandidate");
      endCall();
    };
  }, []);

  useEffect(() => {
    if (callStatus === "outgoing") {
      callUser();
    } else if (callStatus === "ended") {
      if (endCallReason === "self") {
        endCall();
      } else {
        resetCall();
      }
    } else if (callStatus === "accepted") {
      answerCall();
    }
  }, [callStatus]);
  const sendSdp = async (sdpType: "offer" | "answer") => {
    if (!callStateRef.current.peerConnection) {
      callStateRef.current.peerConnection = createPeerConnection();
    }
    let sdp: RTCSessionDescriptionInit;
    if (sdpType === "offer") {
      sdp = await callStateRef.current.peerConnection.createOffer();
    } else {
      sdp = await callStateRef.current.peerConnection.createAnswer();
    }
    await callStateRef.current.peerConnection.setLocalDescription(sdp);
    callsSocket.emit("sendSdp", {
      to: callStateRef.current.interlocuter?._id,
      sdp: sdp,
      sdpType: sdpType,
      from: { ...callStateRef.current.currentUser, ...mediaState },
    });
  };

  const sendMediaStateUpdate = (newMediaState: TMediaState) => {
    if (interlocuter) {
      callsSocket.emit("mediaStateChange", {
        from: currentUser,
        mediaState: newMediaState,
        to: interlocuter._id,
      });
    }
  };
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
    pc.ontrack = ({ streams: [remoteStream] }) => {
      setRemoteStream(remoteStream);
    };
    pc.onnegotiationneeded = async () => {
      console.log("onnegotiationneeded");
      await sendSdp("offer");
    };
    pc.onicecandidate = (e) => {
      if (e.candidate && interlocuter) {
        callsSocket.emit("iceCandidate", {
          to: interlocuter._id,
          candidate: e.candidate,
        });
      }
    };
    return pc;
  };
  const handleInitLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      setLocalStream(stream);
      if (callStateRef.current.peerConnection) {
        stream.getTracks().forEach((track) => {
          callStateRef.current.peerConnection?.addTrack(track, stream);
        });
      }
    } catch (err) {
      console.error("Error get media devices:", err);
      return null;
    }
  };
  const callUser = async () => {
    if (!currentUser || !callTo) return;
    callStateRef.current.peerConnection = createPeerConnection();
    await handleInitLocalStream();

    const offer = await callStateRef.current.peerConnection.createOffer();

    await callStateRef.current.peerConnection.setLocalDescription(offer);

    callsSocket.emit("callUser", {
      to: callTo,
      sdp: offer,
      from: { ...currentUser, ...mediaState },
    });
  };
  const answerCall = async () => {
    if (!interlocuter || !callStateRef.current.sdp) return;
    callStateRef.current.peerConnection = createPeerConnection();
    await handleInitLocalStream();
    callStateRef.current.peerConnection.setRemoteDescription(
      callStateRef.current.sdp
    );

    const answer = await callStateRef.current.peerConnection.createAnswer();
    await callStateRef.current.peerConnection.setLocalDescription(answer);

    callsSocket.emit("answerCall", {
      to: interlocuter._id,
      sdp: answer,
      from: currentUser,
    });
    dispatch(setCallStatus("active"));
  };
  const endCall = () => {
    if (!interlocuter) return;
    callsSocket.emit("endCall", {
      callWith: interlocuter._id,
    });
    resetCall();
  };
  const resetCall = () => {
    localStream?.getTracks().forEach((track) => {
      track.stop();
    });
    remoteStream?.getTracks().forEach((track) => {
      track.stop();
    });
    callStateRef.current.peerConnection?.close();
    callStateRef.current.peerConnection = null;
    setLocalStream(null);
    setRemoteStream(null);
    dispatch(resetCallState());
  };

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    dispatch(setMediaState({ ...mediaState, muted: !mediaState.muted }));
    sendMediaStateUpdate({ ...mediaState, muted: !mediaState.muted });
  };
  const toggleVideo = () => {
    if (mediaState.videoEnable) {
      disableVideo();
    } else {
      //toast.loading("Video enabling");

      enableVideo();
    }
    dispatch(
      setMediaState({ ...mediaState, videoEnable: !mediaState.videoEnable })
    );

    sendMediaStateUpdate({
      ...mediaState,
      videoEnable: !mediaState.videoEnable,
    });
  };
  const disableVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.stop();
      localStream.removeTrack(track);
      const sender = callStateRef.current.peerConnection
        ?.getSenders()
        .find((sender) => sender.track === track);
      if (sender) {
        callStateRef.current.peerConnection?.removeTrack(sender);
      }
    });
  };
  const enableVideo = async () => {
    if (!localStream) return;
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoTrack = videoStream.getVideoTracks()[0];
      localStream.addTrack(videoTrack);

      if (callStateRef.current.peerConnection) {
        callStateRef.current.peerConnection?.addTrack(videoTrack, localStream);
      }
    } catch (err) {
      console.error("Error get media devices:", err);
      return null;
    }
  };
  return {
    localStream,
    remoteStream,
    toggleMic,
    toggleVideo,
  };
};
export default useCall;
