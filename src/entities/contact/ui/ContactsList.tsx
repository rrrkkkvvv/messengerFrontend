import { useAppSelector } from "../../../app/store/store";
import { Contact } from "..";
import { CiCirclePlus } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import { toastTexts } from "../../../shared/values/strValues";
import Input from "../../../shared/ui/Input/Input";
import { FormEvent, useEffect, useState } from "react";
import { useCreateGroupConversationMutation } from "../api/contactApi";
import toast from "react-hot-toast";
import { TContact } from "../../../shared/types/Contact";
import { selectCurrentUser } from "../../user";
import {
  selectContactsList,
  selectIsLoadnigContacts,
  selectUsersOnlineEmails,
} from "../model/contactSlice";
import ContactsSkeleton from "./ContactsSkeleton";
import SolidButton from "../../../shared/ui/Button/SolidButton";

const ContactsList = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const contactsList = useAppSelector(selectContactsList);
  const isLoadingContacts = useAppSelector(selectIsLoadnigContacts);
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);
  const [createGroupConversation] = useCreateGroupConversationMutation();
  const navigate = useNavigate();

  const [isGroupCreating, setIsGroupCreating] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState("");
  const [groupMembersList, setGroupMembersList] = useState<string[]>([]);

  useEffect(() => {}, []);
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
    <>
      {isGroupCreating && (
        <form
          className="w-full animate-dropDown   flex justify-center items-center flex-col gap-2 text-white"
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
          <SolidButton className="mt-2">Create</SolidButton>
          <h4 className="mb-2 font-bold">Select users for group</h4>
        </form>
      )}

      <div className="relative  max-h-full overflow-y-scroll   text-gray-50">
        {isLoadingContacts && <ContactsSkeleton />}
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
        className={`right-4 absolute bottom-10      rounded-full box-border  text-6xl cursor-pointer  transition duration-500 z-30 ${
          isGroupCreating
            ? "rotate-45 bg-red-100 text-black hover:bg-red-100  hover:text-white"
            : "hover:text-white bg-gray-300 text-gray-50 hover:bg-gray-200"
        }`}
      />
    </>
  );
};

export default ContactsList;
