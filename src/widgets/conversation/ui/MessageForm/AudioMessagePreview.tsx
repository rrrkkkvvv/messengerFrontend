import { FC, useEffect, useRef, useState } from "react";
import { FaRegPauseCircle } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import WaveSurfer from "wavesurfer.js";
import { formatTime } from "../../../../shared/utils/formatTime";
interface IAudioMessagePreview {
  src: string;
}
const AudioMessagePreview: FC<IAudioMessagePreview> = ({ src }) => {
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
        waveColor: "#e5e5e5",
        progressColor: "rgb(69, 69, 69)",
        barWidth: 4,
        barGap: 3,
        barRadius: 25,
        height: 40,
      });
      if (src) {
        wavesurfer.current.load(src);
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
      <div className="flex items-center justify-center gap-4 w-full">
        {isPlaying ? (
          <>
            <FaRegPauseCircle
              className="text-3xl cursor-pointer"
              onClick={togglePlay}
            />
          </>
        ) : (
          <>
            <FaCirclePlay
              className="text-3xl cursor-pointer"
              onClick={togglePlay}
            />
          </>
        )}
        <div
          ref={containterRef}
          onClick={togglePlay}
          className="relative          w-full  h-full  "
        ></div>
      </div>
      <sub className="text-xs absolute bottom-0 left-1/2  z-20 font-bold    ">
        {formatTime(duration - currentTime)}
      </sub>
    </>
  );
};

export default AudioMessagePreview;
