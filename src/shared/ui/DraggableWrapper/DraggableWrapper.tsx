import { FC, ReactNode, useRef, useState } from "react";
import Draggable from "react-draggable";

type TDraggableWrapperProps = {
  children: ReactNode;
};
const DraggableWrapper: FC<TDraggableWrapperProps> = ({ children }) => {
  const [currentRotate, setCurrentRotate] = useState(0);
  const isDraggingRef = useRef(false);
  const onDrag = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    if (!isDraggingRef.current) {
      setCurrentRotate(currentRotate + 90);
    }
    isDraggingRef.current = false;
  };
  return (
    <Draggable onStop={onStop} onDrag={onDrag} bounds={"parent"}>
      {children}
    </Draggable>
  );
};

export default DraggableWrapper;
