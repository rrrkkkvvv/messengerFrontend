import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FaFileImage } from "react-icons/fa6";
import { formatLastMessageDate } from "../../../shared/utils/formatLastMessageDate";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { TContact } from "../../../shared/types/Contact";
import TypingUser from "./TypingUser";

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
  return (
    <div
      onClick={onClick}
      className="
                    w-full
                    relative
                    flex
                    items-center
                    space-x-3
                    hover:bg-green-200
                    hover:text-black
                    rounded-lg
                    transition
                    cursor-pointer
                    border-b-2
                    border-green-200
                    p-2"
    >
      <Avatar
        isGroup={contact.type === "group"}
        picture={contact.avatarURL}
        isOnline={isOnline}
        isProfileAvatar={false}
        isUserSelectedForGroup={isUserSelectedForGroup}
      />
      <div>
        <div className="truncate max-w-40">{contact.name}</div>
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
                  <>You:</>
                ) : (
                  contact.type === "group" &&
                  contact.lastMessage?.sender && (
                    <span className="truncate max-w-40">
                      {contact.lastMessage.sender.name}:
                    </span>
                  )
                )}

                {
                  // {/* IF NO IMAGE BUT TEXT */}
                  !contact.lastMessage?.messageImage &&
                  contact.lastMessage?.messageText ? (
                    <div className="max-w-40 truncate">
                      {contact.lastMessage.messageText}
                    </div>
                  ) : // IF NO TEXT BUT IMAGE
                  contact.lastMessage?.messageImage &&
                    !contact.lastMessage?.messageText ? (
                    <div className="flex justify-center items-center gap-2">
                      <FaFileImage />
                    </div>
                  ) : // IF  TEXT AND IMAGE
                  contact.lastMessage?.messageImage &&
                    contact.lastMessage?.messageText ? (
                    <>
                      <div className="max-w-20 truncate">
                        {contact.lastMessage?.messageText}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <FaFileImage />
                      </div>
                    </>
                  ) : (
                    // NO TEXT AND NO IMAGE
                    <></>
                  )
                }
              </>
            )}
          </div>

          {((contact.type === "single" && !contact.isTyping) ||
            (contact.type === "group" && !contact.usersTypingIds?.length)) &&
            contact.lastMessage?.senderId === currentUserId &&
            (contact.lastMessage?.seenStatus ? (
              <IoCheckmarkDoneOutline className="text-xl" />
            ) : (
              <IoCheckmarkOutline className="text-xl" />
            ))}
        </div>
      </div>

      <div className="absolute right-5 top-2">
        {contact.lastMessage?.sentAt && (
          <>{formatLastMessageDate(contact.lastMessage?.sentAt)}</>
        )}
      </div>
    </div>
  );
};

export default Contact;
