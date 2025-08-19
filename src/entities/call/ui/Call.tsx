import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../shared/utils/useSocket";
import { apiURLs } from "../../../shared/values/strValues";
import Peer from "simple-peer";

const wsUrl = apiURLs.wsServer.base + apiURLs.wsServer.namespaces.calls;

const callsSocket = useSocket(wsUrl);
const Call = () => {
  const [me, setMe] = useState();
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState();
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo && myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });
    callsSocket.on("me", (id) => {
      setMe(id);
    });
    callsSocket.on("CallUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      callsSocket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
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
  };
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
  };
  return (
    <div>
      <div>
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
      <div>
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
  );
};

export default Call;
