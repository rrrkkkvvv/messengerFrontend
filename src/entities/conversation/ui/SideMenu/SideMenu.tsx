import Avatar from "../../../../shared/ui/Avatar/Avatar";
import { IoCloseOutline } from "react-icons/io5";
import { useDeleteConversationMutation } from "../../api";
import { toastTexts } from "../../../../shared/values/strValues";
import toast from "react-hot-toast";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import { useAppSelector } from "../../../../app/store/store";
import { MdModeEdit } from "react-icons/md";
import { useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

import {
  useKickUserFromConversationMutation,
  useLeaveFromConversationMutation,
} from "../../api/conversationApi";
import GroupConversationEdit from "./GroupConversationEdit";
import AddUsersToGroup from "./AddUsersToGroup";
import SidebarBtn from "../../../../shared/ui/Button/SidebarBtn";
import { selectCurrentUser } from "../../../user";
import BorderedButton from "../../../../shared/ui/Button/BorderedButton";

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
  usersOnline: string[] | null;
}
const SideMenu = ({
  conversationId,
  anotherUser,
  closeSidebarMenu,
  isSidebarMenuVisible,
  isAnotherUserOnline,
  avatarURL,
  creatorId,
  members,
  name,
  usersOnline,
}: ISidebarMenuProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [openAddUsers, setOpenAddUsers] = useState(false);

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
    openAddUsers && setOpenAddUsers(false);
  };
  const handleOpenAddUsers = () => {
    setOpenAddUsers((prev) => !prev);
    isEditing && setIsEditing(false);
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
  const creator = members?.find((member) => member._id === creatorId);
  const isCurrentUserCreator = creatorId === currentUser?._id;
  const removeChatPosibility = isCurrentUserCreator || !isGroup;
  if (isGroup && !creator) return;

  return (
    <div
      className={`absolute right-0 top-0 rounded-xl    w-full md:right-5 md:top-5 md:w-3/4 lg:w-2/4    p-5  transition-all duration-300 bg-gray-300 border border-gray-400 z-30 flex justify-center items-center 
        ${
          isSidebarMenuVisible
            ? "opacity-100 scale-100 translate-0 "
            : "opacity-0 scale-50  -translate-y-1/2 translate-x-1/2"
        } 
        ${isSidebarMenuVisible ? "visible" : "invisible delay-300"}`}
    >
      <div className="absolute  flex right-5 top-5">
        {isCurrentUserCreator && (
          <>
            <SidebarBtn isSelected={isEditing} onClick={handleToggleIsEditing}>
              <MdModeEdit />
            </SidebarBtn>
            <SidebarBtn isSelected={openAddUsers} onClick={handleOpenAddUsers}>
              <AiOutlineUsergroupAdd />
            </SidebarBtn>
          </>
        )}
        <SidebarBtn onClick={closeSidebarMenu}>
          <IoCloseOutline className="text-gray-50" />
        </SidebarBtn>
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
            <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl max-w-40 truncate">
              {isGroup ? name : anotherUser?.name}
            </h1>
          </>
        )}

        {isGroup && (
          <div className=" max-h-96 overflow-auto  ">
            {openAddUsers ? (
              <></>
            ) : (
              <div className="flex  justify-around items-center gap-10 rounded-lg duration-300  select-none   px-9 py-1 max-h-96 overflow-auto border border-gray-50">
                {isCurrentUserCreator ? (
                  <p>You</p>
                ) : (
                  <>
                    <Avatar
                      isProfileAvatar={false}
                      picture={creator?.avatarURL}
                      isOnline={usersOnline?.includes(
                        creator ? creator._id : ""
                      )}
                    />
                    <p className="max-w-16 truncate">{creator?.name}</p>
                  </>
                )}
                <h2 className="text-md text-gray-50">Owner</h2>
              </div>
            )}
            {openAddUsers ? (
              <AddUsersToGroup
                conversationId={conversationId}
                members={members}
              />
            ) : (
              <>
                {members?.map((member) => {
                  if (member._id === creatorId) return;

                  return (
                    <div
                      key={member._id}
                      className="flex justify-between items-center gap-10 rounded-lg duration-300 cursor-pointer hover:bg-gray-400 px-9 py-1 animate-fadeIn  overflow-auto "
                    >
                      <Avatar
                        isProfileAvatar={false}
                        picture={member.avatarURL}
                        isOnline={usersOnline?.includes(member._id)}
                      />
                      <p className="max-w-16 truncate">{member.name}</p>
                      {isCurrentUserCreator && (
                        <button
                          onClick={() => {
                            handleKickUser(member._id);
                          }}
                          className="text-4xl rounded-full   border transition text-red-100 hover:border-gray-50"
                        >
                          <IoCloseOutline />
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
        {!isGroup && (
          <h1 className="text-lg sm:text-lg md:text-base lg:text-lg xl:text-xl">
            {anotherUser?.email}
          </h1>
        )}

        <BorderedButton
          onClick={
            removeChatPosibility
              ? handleDeleteConversation
              : handleLeaveConversation
          }
          className=" text-lg px-2 border border-gray-100 "
        >
          {removeChatPosibility ? <>Remove chat</> : <>Leave chat</>}
        </BorderedButton>
      </div>
    </div>
  );
};
export default SideMenu;
