import Modal from "../../shared/ui/Modal/Modal";

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <img alt="Image" className="object-cover w-full h-full " src={src} />
    </Modal>
  );
};

export default ImageModal;
