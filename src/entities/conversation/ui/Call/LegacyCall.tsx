import { FC, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../../shared/utils/useSocket";
import { apiURLs } from "../../../../shared/values/strValues";
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdOutlineCallEnd, MdOutlinePhoneCallback } from "react-icons/md";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;

const callsSocket = useSocket(wsUrl);
interface ICallProps {
  currentUser: TUserInfo | null;
  callTo: string | undefined;
}
const Call: FC<ICallProps> = ({ callTo, currentUser }) => {
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState<TUserInfo | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef<HTMLVideoElement | null>(null);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  useEffect(() => {
    callsSocket.emit("joinCallsSocket");

    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo && myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
    callsSocket.on("iceCandidate", ({ candidate }) => {
      peerConnectionRef.current?.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });
    callsSocket.on("callUser", ({ sdp, from }) => {
      setReceivingCall(true);
      setCaller(from);
      peerConnectionRef.current = new RTCPeerConnection({
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
      });
      peerConnectionRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          callsSocket.emit("iceCandidate", {
            to: from,
            candidate: e.candidate,
          });
        }
      };
      peerConnectionRef.current.ontrack = ({ streams: [remoteStream] }) => {
        if (userVideo && userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      };
    });
    callsSocket.on("callEnded", () => {
      console.log("callEnded");
    });
  }, []);

  const callUser = async () => {
    if (!currentUser || !callTo) return;
    peerConnectionRef.current = new RTCPeerConnection();
    // const dataChannel = peerConnectionRef.current.createDataChannel("call");

    // dataChannel.onopen = () => {
    //   console.log("channel opened");
    // };
    // dataChannel.onmessage = (e) => {
    //   console.log(`Message: ${e.data}`);
    // };
    peerConnectionRef.current.ontrack = (e) => {
      if (!userVideo.current) return;
      userVideo.current.srcObject = e.streams[0];
    };
    peerConnectionRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        callsSocket.emit("iceCandidate", {
          to: callTo,
          candidate: e.candidate,
        });
      }
    };
    stream?.getTracks().forEach((track) => {
      peerConnectionRef?.current?.addTrack(track, stream);
    });
    const offer = await peerConnectionRef.current.createOffer();
    peerConnectionRef.current.setLocalDescription(offer);
    callsSocket.emit("callUser", {
      to: callTo,
      sdp: offer,
      from: currentUser,
    });
    // const peer = new Peer({
    //   initiator: true,
    //   trickle: false,
    //   stream: stream,
    //   config: {
    //     iceServers: [
    //       { urls: "stun:stun.l.google.com:19302" },
    //       { urls: "stun:stun.l.google.com:5349" },
    //       { urls: "stun:stun1.l.google.com:3478" },
    //       { urls: "stun:stun1.l.google.com:5349" },
    //       { urls: "stun:stun2.l.google.com:19302" },
    //       { urls: "stun:stun2.l.google.com:5349" },
    //       { urls: "stun:stun3.l.google.com:3478" },
    //       { urls: "stun:stun3.l.google.com:5349" },
    //       { urls: "stun:stun4.l.google.com:19302" },
    //       { urls: "stun:stun4.l.google.com:5349" },
    //     ],
    //   },
    // });

    // peer.on("signal", (data) => {
    //   if (!callTo) return;
    //   callsSocket.emit("callUser", {
    //     userToCall: callTo,
    //     signalData: data,
    //     from: currentUser?._id,
    //   });
    // });

    // peer.on("stream", (stream) => {
    //   if (userVideo && userVideo.current) {
    //     userVideo.current.srcObject = stream;
    //   }
    // });
    // callsSocket.on("callAccepted", (signal) => {
    //   setCallAccepted(true);
    //   peer.signal(signal);
    // });

    // connectionRef.current = peer;
  };

  const answerCall = async () => {
    const offer: RTCSessionDescriptionInit = { type: "offer" };
    peerConnectionRef.current = new RTCPeerConnection();
    peerConnectionRef.current.ontrack = (e) => {
      if (!userVideo.current) return;
      userVideo.current.srcObject = e.streams[0];
    };
    peerConnectionRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        callsSocket.emit("iceCandidate", {
          to: callTo,
          candidate: e.candidate,
        });
      }
    };
    peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    peerConnectionRef.current.setLocalDescription(answer);

    setCallAccepted(true);
  };
  const leaveCall = () => {
    setCallEnded(true);
    peerConnectionRef.current?.close();
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex border border-purple-50">
        <div className="w-80 h-80">
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "300px" }}
            ></video>
          )}
        </div>
        <div className="w-80 h-80">
          {callAccepted && !callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "300px" }}
            ></video>
          ) : (
            <></>
          )}
        </div>
      </div>
      {callAccepted && !callEnded ? (
        <MdOutlineCallEnd
          onClick={leaveCall}
          className="text-red-100 text-5xl cursor-pointer"
        />
      ) : (
        <BiSolidPhoneCall
          onClick={callUser}
          className="text-green-200 text-5xl cursor-pointer"
        />
      )}
      {receivingCall && !callAccepted && (
        <MdOutlinePhoneCallback
          className="text-green-200 text-5xl cursor-pointer"
          onClick={answerCall}
        />
      )}
    </div>
  );
};

export default Call;
