import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { selectCurrentConversationId } from "../../conversation/";
import {
  incrementCallDuration,
  resetCallState,
  selectCallEndReason,
  selectCallStatus,
  selectCallTo,
  selectInterlocuter,
  selectMediaState,
  setCallDuration,
  setCallEndReason,
  setCallFrom,
  setCallStatus,
  setInterlocuter,
  setMediaState,
} from "../model/callSlice";
import { selectCurrentUser } from "../../user";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { rtcConfig } from "../../../shared/utils/rtcConfig";
import toast from "react-hot-toast";
import { TMediaState } from "../../../shared/types/callTypes";
import { TCallParticipant, TCallStatus } from "../api/callTypes";
import { Socket } from "socket.io-client";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;
type TCallStateRef = {
  interlocuter: TCallParticipant | null;
  callStatus: TCallStatus;
  callTo: string | null;
  sdp: RTCSessionDescriptionInit | null;
  peerConnection: RTCPeerConnection | null;
  currentUser: TUserInfo | null;
  callMessageId: string | null;
};
const useCall = () => {
  const dispatch = useAppDispatch();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const conversationId = useAppSelector(selectCurrentConversationId);
  const callTo = useAppSelector(selectCallTo);
  const currentUser = useAppSelector(selectCurrentUser);
  const callStatus = useAppSelector(selectCallStatus);
  const endCallReason = useAppSelector(selectCallEndReason);
  const interlocuter = useAppSelector(selectInterlocuter);
  const mediaState = useAppSelector(selectMediaState);

  const callsSocket = useRef<Socket | null>(null);
  // REFS for states because of stale closure
  const callStateRef = useRef<TCallStateRef>({
    interlocuter: interlocuter,
    currentUser: null,
    callStatus: callStatus,
    callTo: callTo,
    sdp: null,
    peerConnection: null,
    callMessageId: null,
  });
  useEffect(() => {
    callStateRef.current.currentUser = currentUser;
  }, [currentUser]);
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
    if (callsSocket.current) {
      callsSocket.current.close();
      callsSocket.current = null;
    }

    callsSocket.current = useSocket(wsUrl);
    callsSocket.current.emit("joinCallsSocket");

    callsSocket.current.on("iceCandidate", ({ candidate }) => {
      callStateRef.current.peerConnection?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });
    callsSocket.current.on("mediaStateChanged", ({ from, mediaState }) => {
      if (callStateRef.current?.interlocuter?._id !== from._id) return;

      dispatch(
        setInterlocuter({ ...callStateRef.current.interlocuter, ...mediaState })
      );
    });
    callsSocket.current.on("incomingCall", ({ sdp, from, callMessageId }) => {
      if (callStateRef.current.callStatus !== "idle") {
        callsSocket.current?.emit("endCall", {
          callWith: from._id,
          isAnswered: false,
          callMessageId,
        });
        return;
      }
      callStateRef.current.callMessageId = callMessageId;
      callStateRef.current.sdp = sdp;
      dispatch(setCallFrom(from._id));
      dispatch(setInterlocuter(from));
      dispatch(setCallStatus("incoming"));
    });
    callsSocket.current.on("callAccepted", ({ sdp, from }) => {
      if (
        callStateRef.current.callStatus === "outgoing" &&
        callStateRef.current.callTo === from._id
      ) {
        dispatch(setCallStatus("active"));

        callStateRef.current?.peerConnection?.setRemoteDescription(sdp);
      }
    });
    callsSocket.current.on("callEnded", () => {
      dispatch(setCallEndReason("interlocuter"));

      dispatch(setCallStatus("ended"));
    });
    callsSocket.current.on("newSdp", ({ sdp, from, sdpType }) => {
      if (callStateRef.current.interlocuter?._id === from._id) {
        callStateRef.current?.peerConnection?.setRemoteDescription(sdp);

        if (sdpType === "offer") {
          sendSdp("answer");
        }
      }
    });
    callsSocket.current.on("newCallMessageId", ({ callMessageId }) => {
      callStateRef.current.callMessageId = callMessageId;
    });
    callsSocket.current.on("callStarted", ({ startTime }) => {
      setCallStartTime(startTime);
    });
    return () => {
      if (!callsSocket.current) return;
      callsSocket.current.off("newSdp");
      callsSocket.current.off("callEnded");
      callsSocket.current.off("callAccepted");
      callsSocket.current.off("incomingCall");
      callsSocket.current.off("mediaStateChanged");
      callsSocket.current.off("iceCandidate");
      callsSocket.current.close();
      callsSocket.current = null;
      endCall();
    };
  }, []);
  useEffect(() => {
    dispatch(setCallDuration(0));
    let interval: NodeJS.Timeout;
    if (callStartTime) {
      interval = setInterval(() => {
        dispatch(incrementCallDuration());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);
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
    if (!callsSocket.current) return;
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
    callsSocket.current.emit("sendSdp", {
      to: callStateRef.current.interlocuter?._id,
      sdp: sdp,
      sdpType: sdpType,
      from: { ...callStateRef.current.currentUser, ...mediaState },
    });
  };

  const sendMediaStateUpdate = (newMediaState: TMediaState) => {
    if (!interlocuter || !callsSocket.current) return;
    callsSocket.current.emit("mediaStateChange", {
      from: currentUser,
      mediaState: newMediaState,
      to: interlocuter._id,
    });
  };
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
    pc.ontrack = ({ streams: [remoteStream] }) => {
      setRemoteStream(remoteStream);
    };
    pc.onnegotiationneeded = async () => {
      await sendSdp("offer");
    };
    pc.onicecandidate = (e) => {
      if (e.candidate && interlocuter && callsSocket.current) {
        callsSocket.current.emit("iceCandidate", {
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
    if (!currentUser || !callTo || !callsSocket.current) return;
    callStateRef.current.peerConnection = createPeerConnection();
    await handleInitLocalStream();

    const offer = await callStateRef.current.peerConnection.createOffer();

    await callStateRef.current.peerConnection.setLocalDescription(offer);

    callsSocket.current.emit("callUser", {
      to: callTo,
      sdp: offer,
      from: { ...currentUser, ...mediaState },
      conversationId: conversationId,
    });
  };
  const answerCall = async () => {
    if (!interlocuter || !callStateRef.current.sdp || !callsSocket.current)
      return;
    callStateRef.current.peerConnection = createPeerConnection();
    await handleInitLocalStream();
    callStateRef.current.peerConnection.setRemoteDescription(
      callStateRef.current.sdp
    );

    const answer = await callStateRef.current.peerConnection.createAnswer();
    await callStateRef.current.peerConnection.setLocalDescription(answer);

    callsSocket.current.emit("answerCall", {
      to: interlocuter._id,
      sdp: answer,
      from: currentUser,
      callMessageId: callStateRef.current.callMessageId,
    });
    dispatch(setCallStatus("active"));
  };
  const endCall = () => {
    if (!interlocuter || !callsSocket.current) return;
    callsSocket.current.emit("endCall", {
      callWith: interlocuter._id,
      startTime: callStartTime,
      callMessageId: callStateRef.current.callMessageId,
      isAnswered: true,
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
    if (mediaState.muted) {
      toast.success("Unmuted");
    } else {
      toast.success("Muted");
    }
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    dispatch(setMediaState({ ...mediaState, muted: !mediaState.muted }));
    sendMediaStateUpdate({ ...mediaState, muted: !mediaState.muted });
  };
  const toggleVideo = async () => {
    if (mediaState.videoEnable) {
      disableVideo();
      toast.success("Video disabled");
    } else {
      const toastId = toast.loading("Video enabling...");
      try {
        await enableVideo();
        toast.success("Video enabled");
      } catch (err) {
        toast.error(
          "Failed to enable video. Please check your camera and permissions"
        );
      }
      toast.dismiss(toastId);
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
