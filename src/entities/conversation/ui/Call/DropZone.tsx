import { useDroppable } from "@dnd-kit/core";
const DropZone = () => {
  const { setNodeRef } = useDroppable({
    id: "dropZone",
  });

  return (
    <div ref={setNodeRef} className={`absolute w-full  h-60 md:h-40  `}></div>
  );
};

export default DropZone;
