import { MouseEvent, useState } from "react";
import ImageModal from "../../../../shared/ui/ImageModal/ImageModal.tsx";
import { TMessageInfo } from "../../api/conversationTypes";
import { formatTime } from "../../../../shared/utils/formatTime";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes.ts";

type TMessageBoxProps = {
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
  handleContextMenu,
}: TMessageBoxProps) => {
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  const isCurrentUser = message.sender_name === currentUser.name;
  const backgroundColor = isCurrentUser ? "bg-green-700" : "bg-green-900";
  return (
    <div
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
        className={`h-max text-base md:text-lg rounded-md text-left p-3 flex flex-col text-white ${backgroundColor}`}
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
          <sub className="text-xs ">
            &nbsp;&nbsp;
            {message.edited_at && "edited"}
            &nbsp;
            {formatTime(message.sent_at)}
          </sub>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
