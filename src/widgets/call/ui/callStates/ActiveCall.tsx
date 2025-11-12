import { FiVideo, FiVideoOff } from "react-icons/fi";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";

import { MdCallEnd } from "react-icons/md";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store/store";
import {
  selectInterlocuter,
  selectMediaState,
  setCallEndReason,
  setCallStatus,
} from "../../../../entities/call/";
import Avatar from "../../../../shared/ui/Avatar/Avatar";
import Audio from "../../../../shared/ui/Audio/Audio";
import Video from "../../../../shared/ui/Video/Video";
import { formatTime } from "../../../../shared/utils/formatTime";

interface IActiveCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  toggleMic: () => void;
  toggleVideo: () => void;
  callDuration: number;
}

const ActiveCall: FC<IActiveCallProps> = ({
  localStream,
  remoteStream,
  toggleMic,
  toggleVideo,
  callDuration,
}) => {
  const interlocuter = useAppSelector(selectInterlocuter);
  const mediaState = useAppSelector(selectMediaState);

  const dispatch = useAppDispatch();
  const handleEndCall = () => {
    dispatch(setCallStatus("ended"));
    dispatch(setCallEndReason("self"));
  };

  if (!interlocuter) return <></>;
  return (
    <>
      {!interlocuter.videoEnable && !mediaState.videoEnable ? (
        <div className="gap-5">
          <div className="flex items-center gap-5 flex-col ">
            <div className=" max-w-40 truncate text-3xl">
              {interlocuter.name}
            </div>
            <div>{formatTime(callDuration)}</div>
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
          <Audio
            className=""
            enabled={!interlocuter.videoEnable}
            isMuted={interlocuter.muted}
            stream={remoteStream}
          />
        </div>
      ) : (
        <div className="flex absolute w-full h-full z-10">
          <Video
            className={`remote absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-h-1/2 object-cover`}
            isMuted={false}
            stream={remoteStream}
            enabled={interlocuter.videoEnable}
          />

          <Video
            className={` absolute max-h-1/2  rounded-xl  z-20 ${
              interlocuter.videoEnable
                ? "w-1/4 right-0 bottom-0 "
                : " w-full -translate-y-1/2 top-1/2 "
            }`}
            isMuted={true}
            stream={localStream}
            enabled={mediaState.videoEnable}
          />
        </div>
      )}

      <div
        className={`  flex gap-5  ${
          interlocuter.videoEnable || mediaState.videoEnable
            ? "absolute bottom-10 z-20"
            : ""
        }`}
      >
        <div className="flex  w-full justify-around">
          <div
            onClick={toggleMic}
            className=" w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center"
          >
            {mediaState.muted ? (
              <CiMicrophoneOff className="text-gray-50 text-6xl    " />
            ) : (
              <CiMicrophoneOn className="text-gray-50 text-6xl    " />
            )}
          </div>
        </div>
        <div onClick={handleEndCall} className="flex  w-full justify-around">
          <div className="bg-red-100 w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center">
            <MdCallEnd className="text-gray-50 text-6xl    " />
          </div>
        </div>
        <div className="flex  w-full justify-around">
          <div
            onClick={toggleVideo}
            className=" w-20 h-20 md:w-16 md:h-16 rounded-full cursor-pointer flex justify-center items-center"
          >
            {mediaState.videoEnable ? (
              <FiVideo className="text-gray-50 text-6xl    " />
            ) : (
              <FiVideoOff className="text-gray-50 text-6xl    " />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveCall;
