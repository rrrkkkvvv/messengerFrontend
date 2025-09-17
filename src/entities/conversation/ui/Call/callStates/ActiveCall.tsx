import Avatar from "../../../../../shared/ui/Avatar/Avatar";
import { FiVideo } from "react-icons/fi";
import { CiMicrophoneOff } from "react-icons/ci";

import { MdCallEnd } from "react-icons/md";
import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/store";
import {
  selectInterlocuter,
  setCallEndReason,
  setCallStatus,
} from "../../../model/callSlice";
interface IActiveCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const ActiveCall: FC<IActiveCallProps> = ({ localStream, remoteStream }) => {
  const [isVideoActive, setIsVideoActive] = useState(true);
  const interlocuter = useAppSelector(selectInterlocuter);

  const [isUserVideo, setIsUserVideo] = useState(true);
  const myVideo = useRef<HTMLVideoElement | null>(null);

  const interlocuterVideo = useRef<HTMLVideoElement | null>(null);
  // const userAudio = useRef<HTMLAudioElement | null>(null);

  const dispatch = useAppDispatch();
  const handleEndCall = () => {
    dispatch(setCallStatus("ended"));
    dispatch(setCallEndReason("self"));
  };

  useEffect(() => {
    if (!myVideo.current || !interlocuterVideo.current) return;
    myVideo.current.srcObject = localStream;
    interlocuterVideo.current.srcObject = remoteStream;
  }, [remoteStream, localStream]);
  if (!interlocuter) return <></>;
  return (
    <>
      {!isVideoActive && (
        <div className="gap-5">
          <div className="flex items-center gap-5 flex-col ">
            <div className="  text-3xl">{interlocuter.name}</div>
            <Avatar
              isMobileCallAvatar={true}
              isProfileAvatar={true}
              picture={interlocuter.avatarURL}
              hideOnline={true}
            />
          </div>
          <div className="w-full text-center mt-2 md:mt-0 uppercase text-2xl opacity-75  ">
            active call
          </div>
        </div>
      )}
      <div className="flex absolute w-full h-full z-10">
        <video
          className="w-full h-full  absolute "
          playsInline
          muted
          ref={interlocuterVideo}
          autoPlay
        ></video>

        {/* <audio
          className="w-full h-full  absolute "
          ref={userAudio}
          autoPlay
        ></audio> */}
        <video
          className={`  absolute w-1/4  right-0 bottom-0 z-20  ${
            isUserVideo ? " " : "w-full h-full"
          }`}
          muted
          playsInline
          ref={myVideo}
          autoPlay
        ></video>
      </div>
      <div
        className={`  flex gap-5  ${
          isVideoActive ? "absolute bottom-10 z-20" : ""
        }`}
      >
        <div className="flex  w-full justify-around">
          <div className=" w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center">
            {/* <CiMicrophoneOn className="text-white text-6xl    " /> */}
            <CiMicrophoneOff className="text-white text-6xl    " />
          </div>
        </div>
        <div onClick={handleEndCall} className="flex  w-full justify-around">
          <div className="bg-red-100 w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center">
            <MdCallEnd className="text-white text-6xl    " />
          </div>
        </div>
        <div className="flex  w-full justify-around">
          <div className=" w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center">
            <FiVideo className="text-white text-6xl    " />
            {/* <FiVideoOff className="text-white text-6xl    " /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveCall;
