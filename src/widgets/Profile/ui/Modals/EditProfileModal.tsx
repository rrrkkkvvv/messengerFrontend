import { FC } from "react";
import Modal from "../../../../shared/ui/Modal/Modal";
import EditProfile from "../EditProfile";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TUserInfo | null;
}

const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const animationStyles = (isVisible: boolean) => {
    if (isVisible) {
      return "translate-x-0 ";
    } else {
      return " -translate-x-full";
    }
  };
  return (
    <Modal
      styles="  items-start duration-500   transition-transform"
      animationStyles={animationStyles}
      isOpen={isOpen}
      onClose={onClose}
      portalId="editProfilePortal"
      alwaysRender={true}
    >
      <EditProfile closeEditProfile={onClose} currentUser={currentUser} />
    </Modal>
  );
};

export default EditProfileModal;
