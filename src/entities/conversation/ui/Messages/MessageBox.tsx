import { MouseEvent, useEffect, useRef, useState } from "react";
import ImageModal from "../../../../shared/ui/ImageModal/ImageModal.tsx";
import { TMessageInfo } from "../../api/conversationTypes";
import { formatTime } from "../../../../shared/utils/formatTime";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes.ts";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useSetSeenMessageMutation } from "../../api/conversationApi.ts";

type TMessageBoxProps = {
  conversationId: number;
  message: TMessageInfo;
  currentUser: TUserInfo;
  handleContextMenu: (
    e: MouseEvent,
    message: TMessageInfo,
    backgroundColor: "bg-green-700" | "bg-green-900"
  ) => void;
};
const MessageBox = ({
  message,
  currentUser,
  conversationId,
  handleContextMenu,
}: TMessageBoxProps) => {
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [setSeenMessage] = useSetSeenMessageMutation();

  const isCurrentUser = message.sender_id === currentUser.id;
  const backgroundColor = isCurrentUser ? "bg-green-700" : "bg-green-900";
  const handleSetMessageSeen = async () => {
    await setSeenMessage({
      conversationId: conversationId,
      messageId: message.message_id,
    }).unwrap();
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && message.sender_id !== currentUser.id) {
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
  }, []);
  return (
    <div
      ref={messageRef}
      onContextMenu={(e) => handleContextMenu(e, message, backgroundColor)}
      key={message.message_id}
      className={`w-full p-2 flex mb-10 relative ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <ImageModal
        key={message.message_id}
        onClose={() => setImageModalOpen(false)}
        isOpen={imageModalOpen}
        src={message.message_image}
      />

      <div
        className={`h-max min-w-28 text-base md:text-lg  rounded-xl text-left px-3 pt-3 pb-6 flex relative  text-white ${backgroundColor}`}
      >
        <div>
          <span>{message.message_text && message.message_text}</span>
          {message.message_image && (
            <img
              onClick={() => setImageModalOpen(true)}
              className="max-w-52 cursor-pointer"
              src={message.message_image}
            />
          )}

          <sub className="text-xs absolute bottom-0 right-1 ">
            <div className="flex items-center gap-2">
              &nbsp;&nbsp;
              {message.edited_at && "edited"}
              &nbsp;
              {formatTime(message.sent_at)}
              {isCurrentUser &&
                (message.seen ? (
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
