import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { Contact, logout } from "..";
import { CiCirclePlus, CiLogout } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import { toastTexts } from "../../../shared/values/strValues";
import { CgProfile } from "react-icons/cg";
import Input from "../../../shared/ui/Input/Input";
import { FormEvent, useState } from "react";
import { useCreateGroupConversationMutation } from "../api/contactApi";
import toast from "react-hot-toast";
import SubmitBtn from "../../../shared/ui/Button/SubmitBtn";
import { TContact } from "../../../shared/types/Contact";
import { selectCurrentUser } from "../../user";
import {
  selectContactsList,
  selectUsersOnlineEmails,
} from "../model/contactSlice";

const ContactsList = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const contactsList = useAppSelector(selectContactsList);
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);
  const [createGroupConversation] = useCreateGroupConversationMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isGroupCreating, setIsGroupCreating] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState("");
  const [groupMembersList, setGroupMembersList] = useState<string[]>([]);
  const toggleUserToGroup = (userId: string) => {
    if (
      contactsList?.find(
        (contact) => contact._id === userId && contact.type === "single"
      )
    ) {
      if (!groupMembersList.includes(userId)) {
        setGroupMembersList([userId, ...groupMembersList]);
      } else {
        setGroupMembersList(
          groupMembersList.filter((memberId) => userId !== memberId)
        );
      }
    }
  };

  const openConversation = async (contact: TContact) => {
    navigate(`conversation/${contact.type}/${contact._id}`);
  };
  const handleToggleIsGroupCreating = () => {
    setIsGroupCreating((prev) => !prev);
    setGroupMembersList([]);
    setGroupNameValue("");
  };
  const handleChangeGroupName = (e: FormEvent<HTMLInputElement>) => {
    setGroupNameValue(e.currentTarget.value);
  };
  const createGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !groupMembersList.length ||
      !groupNameValue.trim().length ||
      !currentUser
    ) {
      toast.error(toastTexts.error.errorGroupCreate);
      return;
    }

    await createGroupConversation({
      userIds: [...groupMembersList, currentUser._id],
      creatorId: currentUser._id,
      name: groupNameValue,
    }).unwrap();
    toast(toastTexts.success.successGroupCreating);
    setIsGroupCreating(false);
    setGroupMembersList([]);
    setGroupNameValue("");
  };
  return (
    <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden  bg-gray-300">
      <h1 className="h-20 flex  justify-around  text-center border border-gray-200 text-white items-center">
        <button
          className="
                  text-green-400
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-green-400
                  hover:outline-green-200"
          onClick={() => navigate("/profile")}
        >
          <CgProfile className="text-2xl" />
          My profile
        </button>
        <button
          className="
          text-green-400
          flex
          gap-3
          items-center
          ml-2
          px-4
          outline-none
          rounded-sm
          transition-all
          focus:outline-green-400
          hover:outline-green-200"
          onClick={() => logout(navigate, dispatch)}
        >
          <CiLogout className="text-2xl" />
          Logout
        </button>
      </h1>
      {isGroupCreating && (
        <form
          className="w-full animate-dropDown  text-green-400 flex justify-center items-center flex-col gap-2"
          onSubmit={createGroup}
        >
          <h3>Create group conversation</h3>
          <Input
            type="text"
            required
            onChange={handleChangeGroupName}
            value={groupNameValue}
            placeholder="Name your group"
            className="w-2/3 md:w-1/2 hover:border h-9 text-white"
          />
          <SubmitBtn className="py-2 px-5" children="Create" />
          <h4>Select users for group</h4>
        </form>
      )}
      {/* Users list */}
      <div className="relative  max-h-full overflow-y-auto   text-green-200">
        {contactsList &&
          [...contactsList]
            .sort((a, b) => {
              // ALSO SORT BY CREATED_AT IF IT WAS CREATED AND HAVE NO MESSAGES
              const timeA = a.lastMessage?.sentAt
                ? new Date(a.lastMessage.sentAt).getTime()
                : 0;
              const timeB = b.lastMessage?.sentAt
                ? new Date(b.lastMessage.sentAt).getTime()
                : 0;

              return timeB - timeA;
            })
            .map((contact) => {
              let isOnline =
                contact.type === "single" &&
                usersOnlineEmails?.includes(contact.email);

              return (
                <Contact
                  isOnline={!!isOnline}
                  contact={contact}
                  currentUserId={currentUser?._id || null}
                  isUserSelectedForGroup={groupMembersList.includes(
                    contact._id
                  )}
                  onClick={() =>
                    isGroupCreating
                      ? toggleUserToGroup(contact._id)
                      : openConversation(contact)
                  }
                  key={contact._id}
                />
              );
            })}
      </div>
      <CiCirclePlus
        onClick={handleToggleIsGroupCreating}
        className="right-4 absolute bottom-10 bg-green-900 text-green-200 hover:bg-green-800 hover:text-green-100 rounded-full box-border  text-6xl cursor-pointer  z-50"
      />
    </div>
  );
};

export default ContactsList;
