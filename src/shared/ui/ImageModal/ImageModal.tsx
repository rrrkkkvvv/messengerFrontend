import Modal from "../Modal/Modal";

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
      <div className="flex justify-center">
        <img alt="Image" className="object-cover shadow-2xl" src={src} />
      </div>
    </Modal>
  );
};

export default ImageModal;
