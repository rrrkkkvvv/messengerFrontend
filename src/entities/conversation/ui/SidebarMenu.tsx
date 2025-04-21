import Avatar from "../../../shared/ui/Avatar/Avatar";
import { IoCloseOutline } from "react-icons/io5";
import { useDeleteConversationMutation } from "../api/";
import { toastTexts } from "../../../shared/values/strValues";
import toast from "react-hot-toast";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { useAppSelector } from "../../../app/store/store";
import { selectCurrentUser } from "../../user/model";
import { MdModeEdit } from "react-icons/md";
import { useState } from "react";

import {
  useKickUserFromConversationMutation,
  useLeaveFromConversationMutation,
} from "../api/conversationApi";
import GroupConversationEdit from "./groupConversationEdit";

interface ISidebarMenuProps {
  anotherUser?: TUserInfo | null;
  isSidebarMenuVisible: boolean;
  closeSidebarMenu: () => void;
  conversationId: string | null;
  isAnotherUserOnline: boolean;
  members: TUserInfo[] | null;
  name: string | null;
  avatarURL: string | null;
  creatorId: string | null;
  usersOnlineEmails: string[] | null;
}
const SidebarMenu = ({
  conversationId,
  anotherUser,
  closeSidebarMenu,
  isSidebarMenuVisible,
  isAnotherUserOnline,
  avatarURL,
  creatorId,
  members,
  name,
  usersOnlineEmails,
}: ISidebarMenuProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteConversation] = useDeleteConversationMutation();
  const [leaveFromConversation] = useLeaveFromConversationMutation();
  const [kickUserFromConversation] = useKickUserFromConversationMutation();
  const handleDeleteConversation = async () => {
    if (conversationId) {
      const toastId = toast.loading("Loading...");
      try {
        closeSidebarMenu();
        await deleteConversation({ conversationId }).unwrap();

        toast.success(toastTexts.success.successConversationDelete);
      } catch (error) {
        toast.success(toastTexts.success.successConversationDelete);
        console.error("Failed to send message:", error);
      }
      toast.dismiss(toastId);
    }
  };
  const handleLeaveConversation = async () => {
    if (conversationId) {
      try {
        closeSidebarMenu();
        await leaveFromConversation({ conversationId }).unwrap();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleToggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const handleKickUser = async (userId: string) => {
    try {
      if (!conversationId) return;
      kickUserFromConversation({
        conversationId,
        kickedUserId: userId,
      }).unwrap();

      toast.success(toastTexts.success.successKickUser);
    } catch (error) {
      toast.error(toastTexts.error.errorKickUser);
      console.error("Failed to send message:", error);
    }
  };

  const isGroup = !!creatorId;
  const isCurrentUserCreator = creatorId === currentUser?._id;
  return (
    <div
      className={`absolute right-5 top-5 rounded-xl   w-4/5  md:w-3/4 lg:w-2/4   p-5  transition-all duration-300 bg-gray-300 border border-gray-100 z-30 flex justify-center items-center 
        ${
          isSidebarMenuVisible
            ? "opacity-100 scale-100 translate-0 "
            : "opacity-0 scale-50  -translate-y-1/2 translate-x-1/2"
        } 
        ${isSidebarMenuVisible ? "visible" : "invisible delay-300"}`}
    >
      <div className="absolute flex right-5 top-5">
        {isCurrentUserCreator && (
          <button
            onClick={handleToggleIsEditing}
            className="  text-2xl h-10 w-10   flex items-center justify-center rounded-full border    transition   text-green-400  hover:border-green-200"
          >
            <MdModeEdit />
          </button>
        )}
        <button
          onClick={closeSidebarMenu}
          className=" text-2xl  h-10 w-10 flex  items-center justify-center  rounded-full border    transition   text-green-400  hover:border-green-200"
        >
          <IoCloseOutline />
        </button>
      </div>

      <div className="flex gap-2 justify-center items-center flex-col  ">
        {isEditing ? (
          <GroupConversationEdit
            conversationId={conversationId}
            creatorId={creatorId}
            currentUser={currentUser}
            avatarURL={avatarURL}
            isAnotherUserOnline={isAnotherUserOnline}
            originalName={name}
          />
        ) : (
          <>
            <h1>
              <Avatar
                picture={isGroup ? avatarURL : anotherUser?.avatarURL}
                isGroup={isGroup}
                isOnline={isAnotherUserOnline}
                isProfileAvatar={false}
              />
            </h1>
            <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl">
              {isGroup ? name : anotherUser?.name}
            </h1>
          </>
        )}

        {isGroup && (
          <div className=" max-h-96 overflow-auto ">
            {isCurrentUserCreator ? (
              <div className="flex justify-around items-center gap-10 rounded-lg duration-300 cursor-pointer hover:bg-gray-100 px-9 py-3 max-h-96 overflow-auto border border-green-200 ">
                <p>You</p>
                <h2 className="text-md text-green-200">Owner</h2>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-10 rounded-lg duration-300 cursor-pointer hover:bg-gray-100 px-9 py-1 max-h-96 overflow-auto  border border-green-200">
                <Avatar
                  isProfileAvatar={false}
                  isGroup={false}
                  picture={
                    members?.find((member) => member._id === creatorId)
                      ?.avatarURL
                  }
                  isOnline={usersOnlineEmails?.includes(
                    members?.find((member) => member._id === creatorId)
                      ?.email || ""
                  )}
                />
                <p>
                  {members?.find((member) => member._id === creatorId)?.name}
                </p>

                <h2 className="text-md text-green-200">Owner</h2>
              </div>
            )}
            {members?.map((member) => {
              if (member._id === creatorId) return;

              return (
                <div
                  key={member._id}
                  className="flex justify-between items-center gap-10 rounded-lg duration-300 cursor-pointer hover:bg-gray-100 px-9 py-1 max-h-96 overflow-auto "
                >
                  <Avatar
                    isProfileAvatar={false}
                    isGroup={false}
                    picture={member.avatarURL}
                    isOnline={usersOnlineEmails?.includes(member.email)}
                  />
                  <p>{member.name}</p>
                  {isCurrentUserCreator && (
                    <button
                      onClick={() => {
                        handleKickUser(member._id);
                      }}
                      className="text-4xl rounded-full   border transition text-red-100 hover:border-green-200"
                    >
                      <IoCloseOutline />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!isGroup && (
          <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl">
            {anotherUser?.email}
          </h1>
        )}
        <h1>
          <button
            onClick={
              !isGroup || isCurrentUserCreator
                ? handleDeleteConversation
                : handleLeaveConversation
            }
            className="text-green-400 mx-2 p-2 rounded-full border border-gray-100 outline-none    transition   hover:border-green-200"
          >
            {isCurrentUserCreator || !isGroup ? (
              <>Remove chat</>
            ) : (
              <>Leave chat</>
            )}
          </button>
        </h1>
      </div>
    </div>
  );
};
export default SidebarMenu;
