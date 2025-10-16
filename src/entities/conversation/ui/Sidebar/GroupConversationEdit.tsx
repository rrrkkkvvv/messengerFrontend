import { TbArrowBackUp } from "react-icons/tb";
import Avatar from "../../../../shared/ui/Avatar/Avatar";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import { IoCloseOutline } from "react-icons/io5";
import Input from "../../../../shared/ui/Input/Input";
import { FormEvent, useEffect, useState } from "react";
import { useUpdateGroupConversationMutation } from "../../api/conversationApi";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import toast from "react-hot-toast";
import { TEditGroupInfo } from "../../api/conversationTypes";
import { toastTexts } from "../../../../shared/values/strValues";
import SolidButton from "../../../../shared/ui/Button/SolidButton";

interface IGroupCOnversationEditProps {
  isAnotherUserOnline: boolean;
  avatarURL: string | null;
  originalName: string | null;
  currentUser: TUserInfo | null;
  conversationId: string | null;
  creatorId: string | null;
}
const GroupConversationEdit = ({
  isAnotherUserOnline,
  avatarURL,
  originalName,
  currentUser,
  creatorId,
  conversationId,
}: IGroupCOnversationEditProps) => {
  const [nameInputValue, setNameValue] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBuffer, setAvatarBuffer] = useState<number[]>([]);

  const [updateGroupConversation] = useUpdateGroupConversationMutation();

  const handleSetAvatarPreview = (url: string) => {
    setAvatarPreview(url);
  };
  const handleSetAvatarBuffer = (fileBuffer: number[]) => {
    setAvatarBuffer(fileBuffer);
  };
  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setNameValue(event.currentTarget.value);
  };
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarBuffer([]);
  };
  const handleResetAvatar = () => {
    setAvatarPreview(avatarURL);
    setAvatarBuffer([]);
  };
  const handleResetUsername = () => {
    if (!originalName) return;
    setNameValue(originalName);
  };
  const handleEditGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser || !conversationId || !creatorId) return;
    const toastId = toast.loading("Loading...");
    try {
      if (
        (nameInputValue === originalName && avatarPreview === avatarURL) ||
        !nameInputValue?.trim()
      ) {
        toast.error(toastTexts.error.errorEditUser);
        return;
      }
      let result;

      let groupInfo: TEditGroupInfo = {
        _id: conversationId,
        creatorId,
      };
      if (nameInputValue !== originalName) {
        groupInfo.name = nameInputValue;
      }
      if (avatarPreview !== avatarURL) {
        groupInfo.avatar = {
          fileBuffer: avatarBuffer,
        };
      }

      result = await updateGroupConversation(groupInfo).unwrap();
      toast.success(toastTexts.success.successEditUser);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "An error occurred");
    } finally {
      toast.dismiss(toastId);
    }
  };
  useEffect(() => {
    if (originalName) {
      setNameValue(originalName);
    }
    setAvatarPreview(avatarURL);
    setAvatarBuffer([]);
  }, [originalName, avatarURL]);
  return (
    <form
      onSubmit={handleEditGroup}
      className="flex w-full justify-center items-center flex-col gap-3  animate-fadeIn"
    >
      <h1>
        <Avatar
          isGroup={true}
          picture={avatarPreview}
          isOnline={isAnotherUserOnline}
          isProfileAvatar={false}
        />
      </h1>
      <div className="flex items-center justify-between gap-5">
        {avatarPreview !== avatarURL && (
          <button
            type="button"
            className="text-gray-50 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50"
            onClick={handleResetAvatar}
          >
            <TbArrowBackUp />
          </button>
        )}
        <UploadButton
          setImagePreview={handleSetAvatarPreview}
          setImageFile={handleSetAvatarBuffer}
        />
        {avatarPreview && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className=" text-gray-50 mx-1  text-3xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50"
          >
            <IoCloseOutline />
          </button>
        )}
      </div>
      <div className="flex items-center">
        {/* Reset username button(exists if username is not saved) */}

        {nameInputValue !== originalName && (
          <button
            className="text-gray-50 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-gray-300 hover:outline-gray-50"
            onClick={handleResetUsername}
          >
            <TbArrowBackUp />
          </button>
        )}
        {/* Username input */}
        <Input
          onChange={handleInputChange}
          value={nameInputValue}
          type="input"
        />
      </div>
      <SolidButton className="py-3 px-3 rounded-xl">
        Save and submit
      </SolidButton>
    </form>
  );
};

export default GroupConversationEdit;
