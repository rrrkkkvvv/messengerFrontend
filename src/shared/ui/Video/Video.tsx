import { FC, useEffect, useRef } from "react";

interface IVideoProps {
  isMuted: boolean;
  enabled: boolean;
  stream: MediaStream | null;
  className: string;
}

const Video: FC<IVideoProps> = ({ enabled, stream, isMuted, className }) => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [enabled, stream]);
  if (!enabled) return <></>;
  return (
    <video
      playsInline
      muted={isMuted}
      autoPlay
      ref={ref}
      className={className}
    ></video>
  );
};

export default Video;
