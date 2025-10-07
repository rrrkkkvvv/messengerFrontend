import { useState } from "react";
import { ContactsList } from "../../../entities/contact";
import CollapsedCall from "../../../entities/conversation/ui/Call/CollapsedCall";
import Header from "./Header";
import ProfileModal from "../../../widgets/Profile";

const SideBar = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  return (
    <>
      <div className=" w-full md:w-2/5 relative     bg-gray-400">
        <Header handleOpenModal={handleOpenModal} />
        <CollapsedCall />

        <ContactsList />
      </div>
      <ProfileModal onClose={handleCloseModal} isOpen={isOpenModal} />
    </>
  );
};

export default SideBar;
