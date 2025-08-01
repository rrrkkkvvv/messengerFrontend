import { FC } from "react";
import Modal from "../../../../shared/ui/Modal/Modal";
import Profile from "../Profile";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const animationStyles = (isVisible: boolean) => {
    if (isVisible) {
      return "translate-x-0 ";
    } else {
      return " -translate-x-full";
    }
  };
  return (
    <Modal
      styles=" items-start duration-500   transition-transform"
      animationStyles={animationStyles}
      isOpen={isOpen}
      onClose={onClose}
      portalId="profilePortal"
      alwaysRender={true}
    >
      <Profile closeProfile={onClose} />
    </Modal>
  );
};

export default ProfileModal;
