import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/store/store";
import { useState } from "react";
import { routes } from "../../../shared/values/strValues";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import EditProfile from "./EditProfile";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { selectCurrentUser } from "../../../entities/user/model/";
import { IoMdSettings } from "react-icons/io";
import SettingsProfile from "./SettingsProfile";
import { TbSettingsOff } from "react-icons/tb";

const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [profileMode, setProfileMode] = useState<"view" | "settings" | "edit">(
    "view"
  );
  const [isSettingProfileModeEdit, setIsSettingProfileModeEdit] =
    useState(false);
  const [isSettingProfileModeSettings, setIsSettingProfileModeSettings] =
    useState(false);
  const handleToggleIsEdit = () => {
    setIsSettingProfileModeEdit(true);
    setTimeout(() => {
      setProfileMode(profileMode !== "edit" ? "edit" : "view");

      setIsSettingProfileModeEdit(false);
    }, 300);
  };
  const handleToggleIsSetings = () => {
    setIsSettingProfileModeSettings(true);
    setTimeout(() => {
      setProfileMode(profileMode !== "settings" ? "settings" : "view");

      setIsSettingProfileModeSettings(false);
    }, 300);
  };

  const navigate = useNavigate();

  return (
    <div className=" w-full md:w-2/5 overflow-y-auto  h-dvh bg-gray-300">
      {/* Navigation*/}
      <h1 className="h-20 flex px-0 lg:px-20  text-2xl justify-between text-center border border-gray-200 text-white items-center">
        <button
          className="text-green-400 mx-2 p-2 text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
          onClick={() => {
            navigate(routes.main);
          }}
        >
          <FaArrowLeft />
        </button>
        <div>
          {profileMode === "view"
            ? "Profile"
            : profileMode === "edit"
            ? "Edit profile"
            : "Settings"}
        </div>
        <div>
          <button
            className={`text-green-400 mx-1 p-1 text-2xl rounded-full outline-none   transition-all  hover:outline-green-200 ${
              isSettingProfileModeSettings &&
              (profileMode === "settings"
                ? "animate-reverseSpin"
                : "animate-spin")
            }`}
            onClick={handleToggleIsSetings}
          >
            {profileMode === "settings" ? <TbSettingsOff /> : <IoMdSettings />}
          </button>

          <button
            className={`text-green-400 mx-1 p-1 text-2xl rounded-full outline-none   transition-all  hover:outline-green-200 ${
              isSettingProfileModeEdit &&
              (profileMode === "edit" ? "animate-scale" : "animate-scale")
            }`}
            onClick={handleToggleIsEdit}
          >
            {profileMode === "edit" ? <FaEye /> : <MdModeEdit />}
          </button>
        </div>
      </h1>
      {/* Profile */}
      <div className="flex flex-col justify-center relative items-center text-white gap-10 h-2/4">
        {/* Profile edit feautures */}
        {profileMode === "view" ? (
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
        ) : profileMode === "edit" ? (
          <EditProfile currentUser={currentUser} />
        ) : (
          <SettingsProfile currentUser={currentUser} />
        )}
      </div>
    </div>
  );
};

export default Profile;
