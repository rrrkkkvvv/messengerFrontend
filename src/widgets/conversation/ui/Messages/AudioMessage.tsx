import { FC, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { TMessageInfo } from "../../../../shared/types/messageTypes";
import { FaCirclePlay } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { FaRegPauseCircle } from "react-icons/fa";
import { formatTime } from "../../../../shared/utils/formatTime";
type TAudioMessage = Extract<TMessageInfo, { isCallInfo: false }>;
interface IAudioMessageProps {
  message: TAudioMessage;
  isCurrentUser: boolean;
  isGroup: boolean;
}
const AudioMessage: FC<IAudioMessageProps> = ({
  message,
  isCurrentUser,
  isGroup,
}) => {
  const containterRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const durationRef = useRef<number>(0);

  useEffect(() => {
    if (containterRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: containterRef.current,
        waveColor: "rgb(0, 0, 0)",
        progressColor: "rgb(69, 69, 69)",
        height: 50,
        width: 200,
      });
      if (message.audioMessage) {
        wavesurfer.current.load(message.audioMessage);
      }
      wavesurfer.current.on("decode", (newDuration) => {
        setDuration(newDuration);
        durationRef.current = newDuration;
      });
      wavesurfer.current?.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
        wavesurfer.current?.setTime(0);
      });
      wavesurfer.current.on("timeupdate", (newCurrentTime) => {
        setCurrentTime(newCurrentTime);
      });
    }
    return () => {
      containterRef.current = null;
    };
  }, []);
  const togglePlay = () => {
    const audio = wavesurfer.current;

    if (!isPlaying) {
      audio?.play();
    } else {
      audio?.pause();
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <>
      {/* <div ref={containterRef} className="w-96"></div> */}
      {!isCurrentUser && isGroup && (
        <div className="text-sm text-gray-50 absolute top-0 left-2 truncate max-w-20">
          {message.sender ? message.sender.name : "Deleted user"}
        </div>
      )}
      <div className="flex flex-col  items-center justify-center ">
        <div className="flex items-center gap-4">
          {isPlaying ? (
            <>
              <FaRegPauseCircle className="text-3xl" onClick={togglePlay} />
            </>
          ) : (
            <>
              <FaCirclePlay className="text-3xl " onClick={togglePlay} />
            </>
          )}
          <div
            ref={containterRef}
            onClick={togglePlay}
            className="relative    flex  justify-center   h-full items-center"
          ></div>
        </div>
        <sub className="text-xs absolute bottom-1 left-9">
          {formatTime(duration - currentTime)}
        </sub>

        <sub className="text-xs absolute bottom-0 right-1 ">
          <div className="flex items-center gap-2">
            &nbsp;&nbsp;
            {message.editedAt && "edited"}
            &nbsp;
            {formatTime(message.sentAt)}
            {isCurrentUser &&
              (message.pending ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-3 w-3 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : message.seenIds.length ? (
                <IoCheckmarkDoneOutline className="text-xl" />
              ) : (
                <IoCheckmarkOutline className="text-xl" />
              ))}
          </div>
        </sub>
      </div>
    </>
  );
};

export default AudioMessage;
