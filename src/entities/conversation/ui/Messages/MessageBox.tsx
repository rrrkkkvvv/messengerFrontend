import { MouseEvent, useEffect, useRef, useState } from "react";
import ImageModal from "../ImageModal/ImageModal.tsx";
import { TMessageInfo } from "../../api/conversationTypes";
import { formatTime } from "../../../../shared/utils/formatTime";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes.ts";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useSetSeenMessageMutation } from "../../api/conversationApi.ts";
import Avatar from "../../../../shared/ui/Avatar/Avatar.tsx";

type TMessageBoxProps = {
  conversationId: string;
  message: TMessageInfo;
  currentUser: TUserInfo;
  isGroup: boolean;
  handleContextMenu: (
    e: MouseEvent,
    message: TMessageInfo,
    backgroundColor: "bg-gray-50" | "bg-gray-250"
  ) => void;
};
const MessageBox = ({
  message,
  currentUser,
  conversationId,
  handleContextMenu,
  isGroup,
}: TMessageBoxProps) => {
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [setSeenMessage] = useSetSeenMessageMutation();

  const isCurrentUser = message.senderId === currentUser._id;
  const color = isCurrentUser ? "text-gray-250" : "text-gray-50";
  const backgroundColor = isCurrentUser ? "bg-gray-50" : "bg-gray-250";
  const handleSetMessageSeen = async () => {
    await setSeenMessage({
      conversationId,
      messageId: message._id,
      userId: currentUser._id,
    }).unwrap();
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          message.senderId !== currentUser._id &&
          !message.seenIds.includes(currentUser._id)
        ) {
          handleSetMessageSeen();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1,
      }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message]);
  return (
    <div
      ref={messageRef}
      onContextMenu={(e) => handleContextMenu(e, message, backgroundColor)}
      key={message._id}
      className={`w-full p-2  flex  relative ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <ImageModal
        key={message._id}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        src={message.messageImage}
      />
      {!isCurrentUser && isGroup && (
        <>
          <Avatar
            hideOnline={true}
            isProfileAvatar={false}
            picture={message.sender ? message.sender.avatarURL : null}
            isMessageAvatar={true}
          />
        </>
      )}
      <div
        className={`h-max min-w-28 text-base md:text-lg   rounded-xl font-semibold text-left px-3 pt-3 pb-6 flex  relative   ${color} ${backgroundColor} ${
          message.messageImage && "px-0  rounded-lg overflow-hidden "
        }`}
      >
        {!isCurrentUser && isGroup && (
          <div className="text-sm text-gray-50 absolute top-0 left-2 truncate max-w-20">
            {message.sender ? message.sender.name : "Deleted user"}
          </div>
        )}
        <div className="flex flex-col  items-center">
          <div className="max-w-52 sm:max-w-96 break-words whitespace-pre-wrap text-wrap ">
            {message.messageText && message.messageText}
          </div>
          {message.messageImage && (
            <img
              onClick={() => setImageModalOpen(true)}
              className=" max-w-52 max-h-58 cursor-pointer "
              src={message.messageImage}
            />
          )}

          <sub className="text-xs absolute bottom-0 right-1 ">
            <div className="flex items-center gap-2">
              &nbsp;&nbsp;
              {message.editedAt && "edited"}
              &nbsp;
              {formatTime(message.sentAt)}
              {isCurrentUser &&
                (message.pending ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-3 w-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : message.seenIds.length ? (
                  <IoCheckmarkDoneOutline className="text-xl" />
                ) : (
                  <IoCheckmarkOutline className="text-xl" />
                ))}
            </div>
          </sub>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
