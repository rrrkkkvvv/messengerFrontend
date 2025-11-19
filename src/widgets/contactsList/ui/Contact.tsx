import Avatar from "../../../shared/ui/Avatar/Avatar";
import { FaFileImage } from "react-icons/fa6";
import { formatDateTime } from "../../../shared/utils/formatDateTime";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { TContact } from "../../../shared/types/Contact";
import TypingUser from "../../conversation/ui/TypingUser";
import { useAppSelector } from "../../../app/store/store";
import { selectCurrentConversationId } from "../../../entities/conversation/";
import { MdCallMade, MdCallReceived } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { formatTime } from "../../../shared/utils/formatTime";

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
    const lastMessage = contact.lastMessage;
    if (!lastMessage) return;
    if (lastMessage.isCallInfo) {
      if (!lastMessage.isEnded && lastMessage.isAnswered) {
        return (
          <div className="flex gap-2 items-center">
            <IoIosCall className="text-xl text-green-200" />
            <div>Active call</div>
            <div>{formatTime(lastMessage.duration)} </div>
          </div>
        );
      }
      if (lastMessage.senderId === currentUserId) {
        if (!lastMessage.isEnded && !lastMessage.isAnswered)
          return (
            <div className="flex gap-2 items-center">
              <MdCallMade className="text-green-200" />
              <div>Outgoing call</div>
            </div>
          );
        return (
          <div className="flex gap-2 items-center">
            <div>Outgoing call</div>
            {lastMessage.isAnswered ? (
              <div>
                <MdCallMade className="text-green-200" />
              </div>
            ) : (
              <div>
                <MdCallMade className="text-red-100" />
              </div>
            )}

            {lastMessage.isAnswered && (
              <div>{formatTime(lastMessage.duration)}</div>
            )}
          </div>
        );
      } else {
        if (!lastMessage.isEnded && !lastMessage.isAnswered)
          return (
            <div className="flex gap-2 items-center">
              <MdCallReceived className="text-green-200" />
              <div>Incoming call</div>
            </div>
          );
        return (
          <div className="flex gap-2 items-center">
            {lastMessage.isAnswered ? (
              <div>
                <MdCallReceived className="text-green-200" />
              </div>
            ) : (
              <div>
                <MdCallReceived className="text-red-100" />
              </div>
            )}
            <div>Incoming call</div>
            {lastMessage.isAnswered && (
              <div>{formatTime(lastMessage.duration)}</div>
            )}
          </div>
        );
      }
    }
    if (!lastMessage.messageImage && lastMessage.messageText) {
      return <div className="max-w-40 truncate">{lastMessage.messageText}</div>;
    } else if (lastMessage.messageImage && !lastMessage.messageText) {
      return (
        <div className="flex justify-center items-center gap-2">
          <FaFileImage />
        </div>
      );
    } else if (lastMessage.messageImage && lastMessage.messageText) {
      return (
        <>
          <div className="max-w-20 truncate">{lastMessage.messageText}</div>
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
                {!contact.lastMessage?.isCallInfo &&
                  (contact.lastMessage?.senderId === currentUserId ? (
                    <span className=" text-gray-150">You:</span>
                  ) : (
                    contact.type === "group" &&
                    contact.lastMessage?.sender && (
                      <span className="truncate max-w-40 text-gray-150">
                        {contact.lastMessage.sender.name}:
                      </span>
                    )
                  ))}
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
          <>{formatDateTime(contact.lastMessage?.sentAt)}</>
        )}
      </div>
    </div>
  );
};

export default Contact;
