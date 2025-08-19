import { FC } from "react";
import Modal from "../../../shared/ui/Modal/Modal";
import Call from "./Call";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallModal: FC<CallModalProps> = ({ isOpen, onClose }) => {
  const animationStyles = (isVisible: boolean) => {
    if (isVisible) {
      return "translate-x-0 ";
    } else {
      return " -translate-x-full";
    }
  };
  return (
    <Modal
      styles="z-50 justify-center items-center bg-black bg-opacity-65 transition-opacity"
      animationStyles={animationStyles}
      isOpen={isOpen}
      onClose={onClose}
      portalId="callPortal"
      alwaysRender={true}
    >
      <Call />
    </Modal>
  );
};

export default CallModal;
