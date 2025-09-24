import { FC, useEffect, useRef } from "react";

interface IAudioProps {
  isMuted: boolean;
  enabled: boolean;
  stream: MediaStream | null;
  className: string;
}

const Audio: FC<IAudioProps> = ({ enabled, stream, isMuted, className }) => {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [enabled, stream]);
  if (!enabled) return <></>;
  return (
    <audio
      playsInline
      muted={isMuted}
      autoPlay
      ref={ref}
      className={className}
    ></audio>
  );
};

export default Audio;
