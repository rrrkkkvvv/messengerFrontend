import { FormEvent, useEffect, useRef, useState } from "react";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { useEditMessageMutation, useSendMessageMutation } from "../../api/";
import { TEditingMessage, TMessageInfo } from "../../api/conversationTypes";
import { FaCheck } from "react-icons/fa";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import {
  useStartTypingMutation,
  useStopTypingMutation,
} from "../../api/conversationApi";
import { TbSend2 } from "react-icons/tb";
import Input from "../../../../shared/ui/Input/Input";
import BorderedButton from "../../../../shared/ui/Button/BorderedButton";
import toast from "react-hot-toast";

type TMessageFormProps = {
  currentUser: TUserInfo | null;
  conversationId: string | null;
  isMessageEdit: boolean;
  editingMessage: TMessageInfo | null;
  handleResetIsEditingMessage: () => void;
};
const MessageForm = ({
  currentUser,
  conversationId,
  isMessageEdit,
  editingMessage,
  handleResetIsEditingMessage,
}: TMessageFormProps) => {
  const [messageText, setMessageText] = useState<string>();
  const [messageId, setMessageId] = useState<string | null>(null);

  const [messageImagePreview, setMessageImagePreview] = useState<string>();
  const [messageImageBuffer, setMessageImageBuffer] = useState<number[]>();

  const [editMessage] = useEditMessageMutation();
  const [sendMessage] = useSendMessageMutation();
  const [startTyping] = useStartTypingMutation();
  const [stopTyping] = useStopTypingMutation();

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleClearMessage = () => {
    handleResetIsEditingMessage();
    setMessageId(null);
    setMessageText("");
    setMessageImagePreview("");
  };
  const handleSetMessageImagePreview = (url: string) => {
    setMessageImagePreview(url);
  };
  const handleResetMessageImage = () => {
    setMessageImagePreview("");
    setMessageImageBuffer(undefined);
  };
  const handleSetMessageImage = (fileBuffer: number[]) => {
    setMessageImageBuffer(fileBuffer);
  };
  const handleInputChange = async (e: FormEvent<HTMLInputElement>) => {
    setMessageText(e.currentTarget.value);
    if (!conversationId) return;
    if (!isTyping) {
      startTyping({ conversationId }).unwrap();
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping({ conversationId }).unwrap();
      setIsTyping(false);
    }, 750);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId) return;
    if (!currentUser) return;
    if (!messageText && !messageImagePreview) {
      toast.error("Message can't be empty");

      return;
    }

    try {
      if (isMessageEdit && messageId && editingMessage) {
        const messageData = { ...editingMessage } as TEditingMessage;
        if (
          messageImageBuffer &&
          messageImagePreview !== editingMessage.messageImage
        ) {
          messageData.messageImage = { fileBuffer: messageImageBuffer };
        } else if (messageImagePreview === editingMessage.messageImage) {
          messageData.messageImage = editingMessage.messageImage;
        } else if (!messageImageBuffer && !messageImagePreview) {
          messageData.messageImage = "";
        }

        messageData.messageText = messageText;

        await editMessage({
          conversationId,
          message: messageData,
        }).unwrap();
      } else {
        await sendMessage({
          conversationId: conversationId,
          message: {
            messageText,
            messageImage: { fileBuffer: messageImageBuffer },
          },
        }).unwrap();
      }
      handleClearMessage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (isMessageEdit && editingMessage) {
      setMessageId(editingMessage._id);
      if (editingMessage.messageText) {
        setMessageText(editingMessage.messageText);
      }
      if (editingMessage.messageImage) {
        setMessageImagePreview(editingMessage.messageImage);
      }
    }
  }, [isMessageEdit, editingMessage]);
  return (
    <form
      onSubmit={(event) => handleSendMessage(event)}
      className={`flex flex-col relative  px-5 justify-center bottom-0 w-full z-30 gap-3   bg-gray-400 border-l-2 border-gray-200 ${
        messageImagePreview && "border border-t-gray-200 py-2"
      }`}
    >
      {messageImagePreview && (
        <>
          <div className="flex justify-center relative mb-4 ">
            <div className="  relative  ">
              <img
                src={messageImagePreview}
                alt="Uploaded"
                className="max-w-96 max-h-44 rounded-lg shadow-md border-2 p-2 border-gray-300"
              />
              <BorderedButton
                className="absolute -right-10 -top-2    rounded-full     transition       "
                type="button"
                onClick={handleResetMessageImage}
              >
                <IoCloseOutline />
              </BorderedButton>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-5 items-center">
        {isMessageEdit && (
          <div>
            <BorderedButton type="button" onClick={handleClearMessage}>
              <IoClose className="text-3xl  text-center" />
            </BorderedButton>
          </div>
        )}
        <button className="   rounded-full     transition   text-gray-300 border hover:border-gray-50"></button>
        <UploadButton
          setImagePreview={handleSetMessageImagePreview}
          setImage={handleSetMessageImage}
        />

        <Input
          className="    md:text-base w-full           focus:outline-none
        bg-gray-400
        transition-all
"
          type="text"
          value={messageText ? messageText : ""}
          onChange={handleInputChange}
          placeholder="Write a message..."
        />
        <div>
          <BorderedButton type="submit" className="text-xl hover:outline-none">
            {isMessageEdit ? <FaCheck /> : <TbSend2 />}
          </BorderedButton>
        </div>
      </div>
    </form>
  );
};

export default MessageForm;
