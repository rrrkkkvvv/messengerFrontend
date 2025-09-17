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
  setCallEndReason,
  setCallFrom,
  setCallStatus,
  setInterlocuter,
} from "../../model/callSlice";
import { selectCurrentUser } from "../../../user";
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" },
  ],
};
const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;

const useCall = () => {
  const dispatch = useAppDispatch();
  const remoteDescriptionSetRef = useRef(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const sdpRef = useRef<RTCSessionDescriptionInit | null>(null);

  const callTo = useAppSelector(selectCallTo);
  const currentUser = useAppSelector(selectCurrentUser);
  const callStatus = useAppSelector(selectCallStatus);
  const endCallReason = useAppSelector(selectCallEndReason);
  const interlocuter = useAppSelector(selectInterlocuter);

  const callsSocket = useSocket(wsUrl);
  // REFS for states because of stale closure
  const callStatusRef = useRef(callStatus);
  const callToRef = useRef(callTo);

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  useEffect(() => {
    callToRef.current = callTo;
  }, [callTo]);
  useEffect(() => {
    callsSocket.emit("joinCallsSocket");

    callsSocket.on("iceCandidate", ({ candidate }) => {
      peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });
    callsSocket.on("incomingCall", ({ sdp, from }) => {
      if (callStatus !== "idle") {
        callsSocket.emit("endCall", {
          callWith: from._id,
        });
        return;
      }

      sdpRef.current = sdp;
      dispatch(setCallFrom(from._id));
      dispatch(setInterlocuter(from));
      dispatch(setCallStatus("incoming"));
    });
    callsSocket.on("callAccepted", ({ sdp, from }) => {
      if (
        callStatusRef.current === "outgoing" &&
        callToRef.current === from._id
      ) {
        dispatch(setCallStatus("active"));
        if (remoteDescriptionSetRef.current) {
          return;
        }
        remoteDescriptionSetRef.current = true;
        peerConnectionRef.current?.setRemoteDescription(sdp);
      }
    });
    callsSocket.on("callEnded", () => {
      dispatch(setCallEndReason("interlocute"));
      dispatch(setCallStatus("ended"));
    });
    return () => {
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

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);
    pc.ontrack = ({ streams: [remoteStream] }) => {
      setRemoteStream(remoteStream);
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
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }
    } catch (e) {
      console.error("Error get media devices:", e);
      return null;
    }
  };
  const callUser = async () => {
    if (!currentUser || !callTo) return;
    peerConnectionRef.current = createPeerConnection();
    await handleInitLocalStream();

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    callsSocket.emit("callUser", {
      to: callTo,
      sdp: offer,
      from: currentUser,
    });
  };
  const answerCall = async () => {
    if (!interlocuter || !sdpRef.current) return;
    peerConnectionRef.current = createPeerConnection();
    await handleInitLocalStream();
    peerConnectionRef.current.setRemoteDescription(sdpRef.current);

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

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
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    dispatch(resetCallState());
  };
  return {
    localStream: localStream,
    remoteStream: remoteStream,
  };
};
export default useCall;
