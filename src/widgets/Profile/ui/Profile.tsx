import { useAppSelector } from "../../../app/store/store";
import { FC, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import SettingsProfile from "./SettingsProfile";
import { selectCurrentUser } from "../../../entities/user";
import { MdEdit } from "react-icons/md";
import EditProfileModal from "./Modals/EditProfileModal";

interface Profile {
  closeProfile: () => void;
}
const Profile: FC<Profile> = ({ closeProfile }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const handleCloseEdit = () => {
    setIsEditProfile(false);
  };
  const handleOpenEdit = () => {
    setIsEditProfile(true);
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`  w-full h-dvh md:w-2/5       overflow-y-auto  bg-gray-300`}
    >
      {/* Navigation*/}
      <h1 className="h-20 flex px-4  justify-between  text-2xl   text-center border border-gray-200 text-white items-center">
        <button
          className={`text-green-400 mx-2 p-2   text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200 overflow-hidden`}
          onClick={closeProfile}
        >
          <FaArrowLeft />
        </button>
        <button
          className={`text-green-400 mx-2 p-2   text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200 overflow-hidden`}
          onClick={handleOpenEdit}
        >
          <MdEdit />
        </button>
      </h1>
      {/* Profile */}
      <div className="flex flex-col justify-center relative items-center text-white gap-10 p-10">
        {/* Profile edit feautures */}

        <>
          <Avatar isProfileAvatar={true} picture={currentUser?.avatarURL} />

          <span className=" text-3xl md:text-2xl truncate max-w-96">
            {currentUser?.name}
          </span>
          <span className=" text-3xl md:text-2xl truncate max-w-96">
            {currentUser?.email}
          </span>
          <span className=" text-3xl md:text-2xl truncate max-w-96">
            {/* {currentUser?.name} */}
          </span>
          <SettingsProfile currentUser={currentUser} />
        </>
        <EditProfileModal
          currentUser={currentUser}
          onClose={handleCloseEdit}
          isOpen={isEditProfile}
        />
        {/* <EditProfile currentUser={currentUser} /> */}
      </div>
    </div>
  );
};

export default Profile;
