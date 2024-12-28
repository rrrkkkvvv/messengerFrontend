import { TbArrowBackUp } from "react-icons/tb";
import SubmitButton from "../../../shared/ui/Button/SubmitButton";
import Input from "../../../shared/ui/Input/Input";
import { IoCloseOutline } from "react-icons/io5";
import UploadButton from "../../../shared/ui/UploadImage/UploadImageButton";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FormEvent, useEffect, useState } from "react";
import { selectCurrentUser, setCurrentUser } from "../../../entities/user";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { useEditUserMutation } from "../../../entities/user/api/usersApi";

import toast from "react-hot-toast";
import { toastTexts } from "../../../shared/values/strValues";
import { TProfile } from "../../../entities/user/api/userTypes";

const EditProfile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [editUser] = useEditUserMutation();
  const dispatch = useAppDispatch();

  const handleSetUserPicture = (url: string) => {
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
  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
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
    <form
      onSubmit={handleEditProfile}
      className="flex w-full justify-center items-center flex-col gap-10"
    >
      <div className="flex w-full justify-center items-center flex-col gap-3">
        {/* User picture */}
        <Avatar
          isProfileAvatar={true}
          picture={userPicture}
          className="
            h-24
            w-24
            md:h-20
            md:w-20
            mb-4"
        />

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
          <UploadButton onUpload={handleSetUserPicture} />

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
        <Input onChange={handleInputChange} value={userName} type="input" />
      </div>
      <SubmitButton children={"Save and submit"} />
    </form>
  );
};

export default EditProfile;
