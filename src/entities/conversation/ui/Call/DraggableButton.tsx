import { useDraggable } from "@dnd-kit/core";
import { FC, ReactNode, useEffect, useState } from "react";
interface IDraggableButtonProps {
  children: ReactNode;
  id: string;
}
const DraggableButton: FC<IDraggableButtonProps> = ({ children, id }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = () => {
    if (!transform) return;
    const { y, x } = transform;
    if (y > 0) {
      return;
    }
    if ((isMobile && y <= -200) || (!isMobile && y <= -100)) {
      return {
        transform: transform
          ? `translate(0, ${isMobile ? -200 : -100}px)`
          : undefined,
      };
    }
    return {
      transform: transform ? `translate(${x}, ${y}px)` : undefined,
    };
  };
  useEffect(() => {
    // Resize of window if there is mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style()}
      className={`  text-white flex items-center justify-center cursor-grab rounded ${
        !isDragging && "transition-all duration-200"
      }`}
    >
      {children}
    </div>
  );
};
export default DraggableButton;
