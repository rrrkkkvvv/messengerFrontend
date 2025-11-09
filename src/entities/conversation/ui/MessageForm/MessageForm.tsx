import { FormEvent, useEffect, useRef, useState } from "react";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { useEditMessageMutation, useSendMessageMutation } from "../../api/";
import { TMessageInfo } from "../../api/conversationTypes";
import { FaCheck } from "react-icons/fa";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

import { TbSend2 } from "react-icons/tb";
import Input from "../../../../shared/ui/Input/Input";
import BorderedButton from "../../../../shared/ui/Button/BorderedButton";
import { newMessage, updateMessage } from "../../model/conversationSlice";
import { useAppDispatch } from "../../../../app/store/store";

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
  const dispatch = useAppDispatch();
  const [messageImagePreview, setMessageImagePreview] = useState<string | null>(
    null
  );
  const [messageImageFile, setMessageImageFile] = useState<File | null>(null);

  const [editMessage] = useEditMessageMutation();
  const [sendMessage] = useSendMessageMutation();
  // TODO: GET FROM CUSTOM HOOK
  // const [startTyping] = useStartTypingMutation();
  // const [stopTyping] = useStopTypingMutation();

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleClearMessage = () => {
    handleResetIsEditingMessage();
    setMessageImageFile(null);
    setMessageText("");
    setMessageImagePreview("");
  };
  const handleSetMessageImagePreview = (url: string) => {
    setMessageImagePreview(url);
  };
  const handleResetMessageImage = () => {
    setMessageImagePreview("");
    setMessageImageFile(null);
  };
  const handleSetMessageImage = (file: File) => {
    setMessageImageFile(file);
  };
  const handleInputChange = async (e: FormEvent<HTMLInputElement>) => {
    setMessageText(e.currentTarget.value);
    if (!conversationId) return;
    if (!isTyping) {
      // startTyping({ conversationId }).unwrap();
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // stopTyping({ conversationId }).unwrap();
      setIsTyping(false);
    }, 750);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!conversationId) return;
    if (!currentUser) return;
    if (!messageText?.trim() && !messageImagePreview) {
      handleClearMessage();
      return;
    }
    const tempId = "temp-" + Date.now();
    if (isMessageEdit && editingMessage && !editingMessage.isCallInfo) {
      const optimisticMessage: TMessageInfo = {
        ...editingMessage,

        messageText: messageText?.trim(),
        messageImage: messageImagePreview ? messageImagePreview : undefined,
        editedAt: new Date().toISOString(),
        pendingId: tempId,
        pending: true,
      };

      dispatch(updateMessage({ updatedMessage: optimisticMessage }));
    } else {
      const optimisticMessage: TMessageInfo = {
        _id: tempId,
        isCallInfo: false,
        senderId: currentUser._id,
        messageText: messageText?.trim() || "",
        messageImage: messageImagePreview ? messageImagePreview : undefined,
        sentAt: new Date().toISOString(),
        pendingId: tempId,
        pending: true,
        seenIds: [],
        conversationId: conversationId,
        sender: currentUser,
      };

      dispatch(newMessage(optimisticMessage));
    }

    try {
      const formData = new FormData();
      if (isMessageEdit && editingMessage) {
        formData.append("messageId", editingMessage._id);
      }
      formData.append("conversationId", conversationId);
      if (messageImageFile) {
        if (
          !editingMessage?.isCallInfo &&
          (!isMessageEdit ||
            (isMessageEdit &&
              messageImagePreview !== editingMessage?.messageImage))
        ) {
          formData.append("messageImage", messageImageFile);
        }
      }
      if (messageText) {
        formData.append("messageText", messageText.trim());
      } else {
        formData.append("messageText", "");
      }
      handleClearMessage();

      if (isMessageEdit) {
        const { data } = await editMessage({ formData }).unwrap();
        if (data.isCallInfo) return;
        dispatch(
          updateMessage({
            updatedMessage: {
              ...data,
              pendingId: tempId,
              pending: false,
            },
          })
        );
      } else {
        const { data } = await sendMessage({ formData }).unwrap();
        if (data.isCallInfo) return;

        dispatch(
          updateMessage({
            updatedMessage: { ...data, pendingId: tempId, pending: false },
          })
        );
      }
      handleClearMessage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (isMessageEdit && editingMessage && !editingMessage.isCallInfo) {
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
        <UploadButton
          setImagePreview={handleSetMessageImagePreview}
          setImageFile={handleSetMessageImage}
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
