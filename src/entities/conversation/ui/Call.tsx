import { FC, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdOutlineCallEnd, MdOutlinePhoneCallback } from "react-icons/md";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import Peer from "simple-peer";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;

const callsSocket = useSocket(wsUrl);
interface ICallProps {
  currentUser: TUserInfo | null;
  callTo: string | undefined;
}
const Call: FC<ICallProps> = ({ callTo, currentUser }) => {
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState();
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
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

    callsSocket.on("callUser", (data) => {
      console.log(data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
    callsSocket.on("callEnded", () => {
      console.log("callEnded");
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
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
      },
    });

    peer.on("signal", (data) => {
      if (!callTo) return;
      callsSocket.emit("callUser", {
        userToCall: callTo,
        signalData: data,
        from: currentUser?._id,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    callsSocket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (data) => {
      callsSocket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    if (!callerSignal) return;
    peer.signal(callerSignal);
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
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
              muted
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
