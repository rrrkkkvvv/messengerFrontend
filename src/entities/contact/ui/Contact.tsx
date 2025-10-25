import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FaFileImage } from "react-icons/fa6";
import { formatLastMessageDate } from "../../../shared/utils/formatLastMessageDate";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { TContact } from "../../../shared/types/Contact";
import TypingUser from "./TypingUser";
import { useAppSelector } from "../../../app/store/store";
import { selectCurrentConversationId } from "../../conversation/model";

interface IContactProps {
  contact: TContact;
  currentUserId: string | null;
  onClick: () => void;
  isOnline: boolean;
  isUserSelectedForGroup: boolean;
}
const Contact = ({
  contact,
  onClick,
  isOnline,
  currentUserId,
  isUserSelectedForGroup,
}: IContactProps) => {
  const currentConversationId = useAppSelector(selectCurrentConversationId);
  const isCurrentConversation = () => {
    const currentConvStyles = "bg-gray-300 text-black";
    if (contact.type === "single") {
      if (!contact.conversationId && !currentConversationId) return "";
      if (contact.conversationId === currentConversationId) {
        return currentConvStyles;
      } else {
        return "";
      }
    } else {
      if (contact._id === currentConversationId) {
        return currentConvStyles;
      } else {
        return "";
      }
    }
  };

  const lastMessageSnipet = () => {
    if (
      !contact.lastMessage?.messageImage &&
      contact.lastMessage?.messageText
    ) {
      return (
        <div className="max-w-40 truncate">
          {contact.lastMessage.messageText}
        </div>
      );
    } else if (
      contact.lastMessage?.messageImage &&
      !contact.lastMessage?.messageText
    ) {
      return (
        <div className="flex justify-center items-center gap-2">
          <FaFileImage />
        </div>
      );
    } else if (
      contact.lastMessage?.messageImage &&
      contact.lastMessage?.messageText
    ) {
      return (
        <>
          <div className="max-w-20 truncate">
            {contact.lastMessage?.messageText}
          </div>
          <div className="flex justify-center items-center gap-2">
            <FaFileImage />
          </div>
        </>
      );
    } else return <></>;
  };
  return (
    <div
      onClick={onClick}
      className={`
                     w-full
                    relative
                    flex
                    items-center
                    space-x-3
                    text-gray-50
                    hover:bg-gray-300
                    rounded-lg
                    transition
                    cursor-pointer
                    p-2 ${isCurrentConversation()}`}
    >
      <Avatar
        isGroup={contact.type === "group"}
        picture={contact.avatarURL}
        isOnline={isOnline}
        isProfileAvatar={false}
        isUserSelectedForGroup={isUserSelectedForGroup}
      />
      <div className="text-gray-50">
        <div className="truncate max-w-52 text-gray-50">{contact.name}</div>
        <div className="flex gap-5">
          <div className="flex gap-2 relative">
            {contact.type === "single" && contact.isTyping ? (
              <TypingUser />
            ) : contact.type === "group" && contact.usersTypingIds?.length ? (
              <TypingUser
                groupTypingStatuses={true}
                userTypingIds={contact.usersTypingIds}
              />
            ) : (
              <>
                {contact.lastMessage?.senderId === currentUserId ? (
                  <span className=" text-gray-150">You:</span>
                ) : (
                  contact.type === "group" &&
                  contact.lastMessage?.sender && (
                    <span className="truncate max-w-40 text-gray-150">
                      {contact.lastMessage.sender.name}:
                    </span>
                  )
                )}
                {lastMessageSnipet()}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex absolute right-5 top-2">
        {((contact.type === "single" && !contact.isTyping) ||
          (contact.type === "group" && !contact.usersTypingIds?.length)) &&
          contact.lastMessage?.senderId === currentUserId &&
          (contact.lastMessage?.seenStatus ? (
            <IoCheckmarkDoneOutline className="text-xl" />
          ) : (
            <IoCheckmarkOutline className="text-xl" />
          ))}
        {contact.lastMessage?.sentAt && (
          <>{formatLastMessageDate(contact.lastMessage?.sentAt)}</>
        )}
      </div>
    </div>
  );
};

export default Contact;
