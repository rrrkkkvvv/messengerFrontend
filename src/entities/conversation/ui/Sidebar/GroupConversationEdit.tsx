import { TbArrowBackUp } from "react-icons/tb";
import Avatar from "../../../../shared/ui/Avatar/Avatar";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import { IoCloseOutline } from "react-icons/io5";
import Input from "../../../../shared/ui/Input/Input";
import SubmitBtn from "../../../../shared/ui/Button/SubmitBtn";
import { FormEvent, useEffect, useState } from "react";
import { useUpdateGroupConversationMutation } from "../../api/conversationApi";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import toast from "react-hot-toast";
import { TEditGroupInfo } from "../../api/conversationTypes";
import { toastTexts } from "../../../../shared/values/strValues";

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
  const [avatarInputValue, setAvatarInputValue] = useState(avatarURL);
  const [nameInputValue, setNameValue] = useState("");
  const [updateGroupConversation] = useUpdateGroupConversationMutation();

  const handleSetAvatarURL = (url: string) => {
    setAvatarInputValue(url);
  };
  const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    setNameValue(event.currentTarget.value);
  };
  const handleRemoveAvatarURL = () => {
    setAvatarInputValue(null);
  };
  const handleResetAvatarURL = () => {
    setAvatarInputValue(avatarURL);
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
        (nameInputValue === originalName && avatarInputValue === avatarURL) ||
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
      if (avatarInputValue !== avatarURL) {
        groupInfo.avatarURL = avatarInputValue;
      }

      result = await updateGroupConversation(groupInfo).unwrap();
      if (result.message === "Group was updated") {
        toast.success(toastTexts.success.successEditUser);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      toast.dismiss(toastId);
    }
  };
  useEffect(() => {
    if (originalName) {
      setNameValue(originalName);
    }
    setAvatarInputValue(avatarURL);
  }, [originalName, avatarURL]);
  return (
    <form
      onSubmit={handleEditGroup}
      className="flex w-full justify-center items-center flex-col gap-2"
    >
      <h1>
        <Avatar
          isGroup={true}
          picture={avatarInputValue}
          isOnline={isAnotherUserOnline}
          isProfileAvatar={false}
        />
      </h1>
      <div className="flex items-center justify-between gap-5">
        {avatarInputValue !== avatarURL && (
          <button
            type="button"
            className="text-green-400 mx-2 p-1 text-3xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
            onClick={handleResetAvatarURL}
          >
            <TbArrowBackUp />
          </button>
        )}
        <UploadButton onUpload={handleSetAvatarURL} />
        {avatarInputValue && (
          <button
            type="button"
            onClick={handleRemoveAvatarURL}
            className=" text-green-400 mx-1  text-3xl rounded-full outline-none   transition-all focus:outline-green-400 hover:outline-green-200"
          >
            <IoCloseOutline />
          </button>
        )}
      </div>
      <div className="flex items-center">
        {/* Reset username button(exists if username is not saved) */}

        {nameInputValue !== originalName && (
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
          value={nameInputValue}
          type="input"
        />
      </div>{" "}
      <SubmitBtn
        children={"Save and submit"}
        className="py-3 px-3 rounded-xl"
      />
    </form>
  );
};

export default GroupConversationEdit;
