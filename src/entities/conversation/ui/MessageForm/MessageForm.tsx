import { FormEvent, useEffect, useState } from "react";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import SubmitButton from "../../../../shared/ui/Button/SubmitButton";
import { IoCloseOutline } from "react-icons/io5";
import { useEditMessageMutation, useSendMessageMutation } from "../../api/";
import { TMessageInfo } from "../../api/conversationTypes";
import { FaArrowLeft } from "react-icons/fa";
import Input from "../../../../shared/ui/Input/Input";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

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

  const [messageImage, setMessageImage] = useState<string>();
  const [editMessage] = useEditMessageMutation();
  const [sendMessage] = useSendMessageMutation();

  const handleClearMessage = () => {
    handleResetIsEditingMessage();
    setMessageId(null);
    setMessageText("");
    setMessageImage("");
  };
  const handleSetMessageImage = (url: string) => {
    setMessageImage(url);
  };
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMessageText(e.currentTarget.value);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId) return;
    if (!currentUser) return;
    if (!messageText && !messageImage) return;

    try {
      if (isMessageEdit && messageId && editingMessage) {
        await editMessage({
          conversationId,
          message: {
            ...editingMessage,
            messageText,
            messageImage,
          },
        }).unwrap();
      } else {
        await sendMessage({
          conversationId: conversationId,
          message: {
            messageText,
            messageImage,
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
        setMessageImage(editingMessage.messageImage);
      }
    }
  }, [isMessageEdit, editingMessage]);
  return (
    <form
      onSubmit={(event) => handleSendMessage(event)}
      className={`flex flex-col relative  px-5 justify-center bottom-0 w-full z-30 gap-3 py-4 bg-gray-300 border-l-2 border-gray-200 ${
        messageImage && "border border-t-gray-200"
      }`}
    >
      {messageImage && (
        <>
          <button
            // Clears state of message image
            type="button"
            onClick={() => handleSetMessageImage("")}
            className="absolute right-5 top-5 text-5xl  rounded-full     transition   text-green-400 border hover:border-green-200"
          >
            <IoCloseOutline />
          </button>
          <div className="flex justify-center  mb-4 ">
            <img
              src={messageImage}
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
        <UploadButton onUpload={handleSetMessageImage} />

        <SubmitButton children={isMessageEdit ? "Edit" : "Send"} />
      </div>
    </form>
  );
};

export default MessageForm;
