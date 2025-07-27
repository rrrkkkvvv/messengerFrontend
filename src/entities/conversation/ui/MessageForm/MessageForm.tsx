import { FormEvent, useEffect, useRef, useState } from "react";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import SubmitBtn from "../../../../shared/ui/Button/SubmitBtn";
import { IoCloseOutline } from "react-icons/io5";
import { useEditMessageMutation, useSendMessageMutation } from "../../api/";
import { TEditingMessage, TMessageInfo } from "../../api/conversationTypes";
import { FaArrowLeft } from "react-icons/fa";
import Input from "../../../../shared/ui/Input/Input";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import {
  useStartTypingMutation,
  useStopTypingMutation,
} from "../../api/conversationApi";

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
  // Input message value
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

    // Запускаем новый таймер на 2 секунды перед отправкой stopTyping
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping({ conversationId }).unwrap();
      setIsTyping(false); // Сбрасываем флаг, чтобы при следующем вводе снова отправить startTyping
    }, 750);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId) return;
    if (!currentUser) return;
    if (!messageText && !messageImagePreview) return;

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
      className={`flex flex-col relative  px-5 justify-center bottom-0 w-full z-30 gap-3 py-4 bg-gray-300 border-l-2 border-gray-200 ${
        messageImagePreview && "border border-t-gray-200"
      }`}
    >
      {messageImagePreview && (
        <>
          <button
            // Clears state of message image
            type="button"
            onClick={handleResetMessageImage}
            className="absolute right-5 top-5 text-5xl  rounded-full     transition   text-green-400 border hover:border-green-200"
          >
            <IoCloseOutline />
          </button>
          <div className="flex justify-center  mb-4 ">
            <img
              src={messageImagePreview}
              alt="Uploaded"
              className="max-w-full h-44 rounded-lg shadow-md border-2 p-2 border-green-400"
            />
          </div>
        </>
      )}

      <div className="flex gap-5 items-center">
        {isMessageEdit && (
          <button
            type="button"
            onClick={handleClearMessage}
            className=" text-4xl  rounded-full     transition   text-green-400 border hover:border-green-200"
          >
            {<FaArrowLeft className=" p-2" />}
          </button>
        )}

        <Input
          type="text"
          onClick={() => {}}
          onChange={handleInputChange}
          placeholder="Input message"
          value={messageText ? messageText : ""}
          className="w-full hover:border"
        />
        <UploadButton
          setImagePreview={handleSetMessageImagePreview}
          setImage={handleSetMessageImage}
        />

        <SubmitBtn children={isMessageEdit ? "Edit" : "Send"} />
      </div>
    </form>
  );
};

export default MessageForm;
