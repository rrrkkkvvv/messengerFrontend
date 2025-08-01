import { FC } from "react";
import Modal from "../../../../shared/ui/Modal/Modal";

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}

const ImageModal: FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null;
  }
  const animationStyles = (isVisible: boolean) => {
    if (isVisible) {
      return "opacity-100 ";
    } else {
      return "opacity-0";
    }
  };
  // const animationStyles = (isVisible: boolean) => {
  //   if (isVisible) {
  //     return "translate-x-0 ";
  //   } else {
  //     return " -translate-x-full";
  //   }
  // };
  return (
    <Modal
      styles="z-50 justify-center items-center bg-black bg-opacity-65 transition-opacity"
      animationStyles={animationStyles}
      isOpen={isOpen}
      onClose={onClose}
      portalId="imageProtal"
    >
      <div className="relative flex items-center    max-w-sm md:max-w-lg justify-center ">
        <img alt="Image" className="object-cover shadow-2xl" src={src} />
      </div>
    </Modal>
  );
};

export default ImageModal;
