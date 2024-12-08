import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { selectCurrentUser, setCurrentUser } from "../../entities/user";
import { useNavigate } from "react-router-dom";
import Avatar from "../../shared/ui/Avatar/Avatar";
import { MdModeEdit } from "react-icons/md";
import { routes, toastTexts } from "../../shared/values/strValues";
import { FaArrowLeft } from "react-icons/fa";
import { FormEvent, useEffect, useState } from "react";
import Input from "../../shared/ui/Input/Input";
import UploadButton from "../../shared/ui/UploadImage/UploadImageButton";
import { TbArrowBackUp } from "react-icons/tb";
import SubmitButton from "../../shared/ui/Button/SubmitButton";
import toast from "react-hot-toast";
import { useEditUserMutation } from "../../entities/user/api/usersApi";
import { IoCloseOutline } from "react-icons/io5";
type TProfile = {
  id: number;
  picture?: null | string;
  name?: string;
};
const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [editUser] = useEditUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleToggle = () => {
    setIsProfileEdit((prev) => !prev);
  };
  const handleSetProfilePicture = (url: string) => {
    setUserPicture(url);
  };
  const handleResetUsername = () => {
    if (currentUser?.name) {
      setUserName(currentUser?.name);
    }
  };
  const handleResetUserPicutre = () => {
    if (currentUser?.picture) {
      setUserPicture(currentUser.picture);
    }
  };
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };
  const handleRemoveUserPicture = () => {
    setUserPicture(null);
  };
  const handleEditProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    const toastId = toast.loading("Loading...");
    try {
      if (
        (userName === currentUser.name &&
          userPicture === currentUser.picture) ||
        !userName.trim()
      ) {
        toast.error(toastTexts.error.errorEditUser);
        return;
      }

      let result;

      let profile: TProfile = {
        id: currentUser.id,
      };
      if (userName !== currentUser.name) {
        profile.name = userName;
      }
      if (userPicture !== currentUser.picture) {
        profile.picture = userPicture;
      }

      result = await editUser(profile).unwrap();

      if (result.message === "User was edited") {
        dispatch(setCurrentUser(result.user));
        toast.success(toastTexts.success.successEditUser);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }
    if (currentUser?.picture) {
      setUserPicture(currentUser.picture);
    }
  }, [currentUser]);

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
          className="text-green-400 mx-1 p-1 text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
          onClick={handleToggle}
        >
          <MdModeEdit />
        </button>
      </h1>
      {/* Profile */}
      <div className="flex flex-col justify-center relative items-center text-white gap-10 h-2/4">
        {/* Profile edit feautures */}

        {isProfileEdit ? (
          <form
            onSubmit={handleEditProfile}
            className="flex w-full justify-center items-center flex-col gap-10"
          >
            <div className="flex w-full justify-center items-center flex-col gap-3">
              {/* User picture */}
              <Avatar picture={userPicture} className={"scale-150 mb-4"} />

              <div className="flex items-center justify-between gap-5">
                {/* Reset picture button(exists if picture is not saved) */}

                {userPicture !== currentUser?.picture && (
                  <button
                    type="button"
                    className="text-green-400 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
                    onClick={handleResetUserPicutre}
                  >
                    <TbArrowBackUp />
                  </button>
                )}
                {/* Choose picture */}
                <UploadButton onUpload={handleSetProfilePicture} />

                <button
                  type="button"
                  onClick={handleRemoveUserPicture}
                  className=" text-green-400 mx-1 p-1 text-2xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </div>
            <div className="flex items-center">
              {/* Reset username button(exists if username is not saved) */}

              {userName !== currentUser?.name && (
                <button
                  className="text-green-400 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
                  onClick={handleResetUsername}
                >
                  <TbArrowBackUp />
                </button>
              )}
              {/* Username input */}
              <Input
                onChange={handleInputChange}
                value={userName}
                type="input"
              />
            </div>
            <SubmitButton children={"Save and submit"} />
          </form>
        ) : (
          <>
            <Avatar picture={currentUser?.picture} className={"scale-150"} />

            <span className="text-2xl">{currentUser?.name}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
