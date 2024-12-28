import { useAppSelector } from "../../app/store/store";
import { selectCurrentUser } from "../../entities/user";
import { useNavigate } from "react-router-dom";
import Avatar from "../../shared/ui/Avatar/Avatar";
import { MdModeEdit } from "react-icons/md";
import { routes } from "../../shared/values/strValues";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

import { FaEye } from "react-icons/fa";
import EditProfile from "./ui/EditProfile";

const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const handleToggle = () => {
    setIsProfileEdit((prev) => !prev);
  };
  const navigate = useNavigate();

  return (
    <div className=" w-full md:w-2/5 overflow-y-auto  h-dvh bg-gray-300">
      {/* Navigation*/}
      <h1 className="h-20 flex px-20  text-2xl justify-around text-center border border-gray-200 text-white items-center">
        <button
          className="text-green-400 mx-2 p-2 text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
          onClick={() => {
            navigate(routes.main);
          }}
        >
          <FaArrowLeft />
        </button>
        <div>Profile</div>
        <button
          className="text-green-400 mx-1 p-1 text-2xl rounded-full outline-none   transition-all  hover:outline-green-200"
          onClick={handleToggle}
        >
          {isProfileEdit ? <FaEye /> : <MdModeEdit />}
        </button>
      </h1>
      {/* Profile */}
      <div className="flex flex-col justify-center relative items-center text-white gap-10 h-2/4">
        {/* Profile edit feautures */}

        {isProfileEdit ? (
          <EditProfile />
        ) : (
          <>
            <Avatar
              isProfileAvatar={true}
              picture={currentUser?.picture}
              className="
       
              h-24
              w-24
              md:h-20
              md:w-20
              "
            />

            <span className=" text-3xl md:text-2xl">{currentUser?.name}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
