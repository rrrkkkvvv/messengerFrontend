import { TbArrowBackUp } from "react-icons/tb";
import Input from "../../../shared/ui/Input/Input";
import { IoCloseOutline } from "react-icons/io5";
import UploadButton from "../../../shared/ui/UploadImage/UploadImageButton";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FormEvent, useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/store/store";
import { useUpdateUserMutation } from "../../../entities/contact/api";

import toast from "react-hot-toast";
import { toastTexts } from "../../../shared/values/strValues";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { setCurrentUser } from "../../../entities/user";
import { TEditedProfile } from "../../../entities/contact/api/contactTypes";
import { FaArrowLeft } from "react-icons/fa";
import BorderedButton from "../../../shared/ui/Button/BorderedButton";
import SolidButton from "../../../shared/ui/Button/SolidButton";
type TEditProfileProps = {
  currentUser: TUserInfo | null;
  closeEditProfile: () => void;
};
const EditProfile = ({ currentUser, closeEditProfile }: TEditProfileProps) => {
  const [userName, setUserName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBuffer, setAvatarBuffer] = useState<number[]>([]);

  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const handleSetAvatarPreview = (url: string) => {
    setAvatarPreview(url);
  };
  const handleSetAvatarBuffer = (fileBuffer: number[]) => {
    setAvatarBuffer(fileBuffer);
  };
  const handleResetUsername = () => {
    if (currentUser?.name) {
      setUserName(currentUser?.name);
    }
  };
  const handleResetUserPicutre = () => {
    if (currentUser) {
      setAvatarPreview(currentUser.avatarURL);
      setAvatarBuffer([]);
    }
  };
  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  };
  const handleRemoveUserPicture = () => {
    setAvatarBuffer([]);
    setAvatarPreview(null);
  };

  const handleEditProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    const toastId = toast.loading("Loading...");
    try {
      if (
        (userName === currentUser.name &&
          avatarPreview === currentUser.avatarURL) ||
        !userName.trim()
      ) {
        toast.error(toastTexts.error.errorEditUser);
        return;
      }

      let result;

      let profile: TEditedProfile = {
        _id: currentUser._id,
      };
      if (userName !== currentUser.name) {
        profile.name = userName;
      }
      if (avatarPreview !== currentUser.avatarURL) {
        profile.avatar = { fileBuffer: avatarBuffer };
      }

      result = await updateUser(profile).unwrap();
      if (result.message === "User was updated") {
        const updatedUserInfo = {
          ...currentUser,

          name: userName,
          avatarURL: avatarPreview,
        } as TUserInfo;

        dispatch(setCurrentUser(updatedUserInfo));
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
    if (currentUser?.avatarURL) {
      setAvatarBuffer([]);
      setAvatarPreview(currentUser.avatarURL);
    }
  }, [currentUser]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`  w-full h-dvh md:w-2/5       overflow-y-auto  bg-gray-400`}
    >
      {/* Navigation*/}
      <h1 className="h-20 flex px-4  justify-between  text-2xl   text-center border border-gray-200 text-gray-50 items-center">
        <BorderedButton onClick={closeEditProfile}>
          <FaArrowLeft />
        </BorderedButton>
      </h1>
      {/* Profile */}
      <div className="flex flex-col justify-center relative items-center text-gray-50 gap-10 p-10">
        {/* Profile edit feautures */}

        <form
          onSubmit={handleEditProfile}
          className="flex w-full justify-center items-center flex-col gap-10"
        >
          <div className="flex w-full justify-center items-center flex-col gap-3">
            {/* User picture */}
            <Avatar isProfileAvatar={true} picture={avatarPreview} />

            <div className="flex items-center justify-between gap-5">
              {/* Reset picture button(exists if picture is not saved) */}

              {avatarPreview !== currentUser?.avatarURL && (
                <button
                  type="button"
                  className="text-gray-50 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50"
                  onClick={handleResetUserPicutre}
                >
                  <TbArrowBackUp />
                </button>
              )}
              {/* Choose picture */}
              <UploadButton
                setImagePreview={handleSetAvatarPreview}
                setImage={handleSetAvatarBuffer}
              />
              <BorderedButton onClick={handleRemoveUserPicture}>
                <IoCloseOutline />
              </BorderedButton>
            </div>
          </div>
          <div className="flex items-center">
            {/* Reset username button(exists if username is not saved) */}

            {userName !== currentUser?.name && (
              <button
                className="text-gray-300 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50"
                onClick={handleResetUsername}
              >
                <TbArrowBackUp />
              </button>
            )}
            {/* Username input */}
            <Input onChange={handleInputChange} value={userName} type="input" />
          </div>
          <SolidButton type="submit">Save and submit</SolidButton>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
