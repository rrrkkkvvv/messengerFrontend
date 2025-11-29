import { FormEvent, useEffect, useRef, useState } from "react";
import UploadButton from "../../../../shared/ui/UploadImage/UploadImageButton";
import { IoClose, IoCloseOutline } from "react-icons/io5";

import { FaCheck, FaLock, FaRegStopCircle, FaTrashAlt } from "react-icons/fa";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

import { TbSend2 } from "react-icons/tb";
import Input from "../../../../shared/ui/Input/Input";
import BorderedButton from "../../../../shared/ui/Button/BorderedButton";
import { newMessage, updateMessage } from "../../../../entities/conversation/";
import { useAppDispatch } from "../../../../app/store/store";
import { TMessageInfo } from "../../../../shared/types/messageTypes";
import {
  useEditMessageMutation,
  useSendMessageMutation,
} from "../../../../entities/message";
import { HiOutlineMicrophone } from "react-icons/hi";
import {
  useStartTypingMutation,
  useStopTypingMutation,
} from "../../../../entities/conversation/api/conversationApi";
import { formatTime } from "../../../../shared/utils/formatTime";
import AudioMessagePreview from "./AudioMessagePreview";

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
  const [audioMessageFile, setAudioMessageFile] = useState<Blob | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const handleRecordHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isLocked) return;
    const point = "touches" in e ? e.touches[0] : e;
    startPos.current = { x: point.clientX, y: point.clientY };

    setIsHolding(true);
    handleStartRecording();
  };
  const handleRecordHoldMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isHolding || isLocked || !isAudioRecording) return;

    const point = "touches" in e ? e.touches[0] : e;
    // const dx = point.clientX - startPos.current.x;
    const dy = point.clientY - startPos.current.y;

    // if (dx < -60) {
    //   handleResetAudioMessage();
    //   setIsHolding(false);
    //   return;
    // }
    if (dy > 0) {
      return;
    }
    if (dy > -10) {
      setRecordBtnPosition(dy);
    }
    if (dy < -10) {
      setIsLocked(true);
      setIsHolding(false);
      return;
    }
  };
  const handleRecordHoldEnd = () => {
    if (!isAudioRecording) return;
    if (isLocked) return;
    handleStopRecording();
  };
  const handleLockedStop = () => {
    if (!isLocked) return;
    handleStopRecording();
  };
  const [editMessage] = useEditMessageMutation();
  const [sendMessage] = useSendMessageMutation();

  const [startTyping] = useStartTypingMutation();
  const [stopTyping] = useStopTypingMutation();

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioMessageURL, setAudioMessageURL] = useState<string | null>("");
  const [audioMessageDuration, setAudioMessageDuration] = useState(0);

  const audioMessageDurationRef = useRef(0);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recordBtnPosition, setRecordBtnPosition] = useState(0);
  const handleStartRecording = async () => {
    handleResetAudioMessage();
    setIsAudioRecording(true);
    try {
      setAudioMessageDuration(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      const timer = setInterval(() => {
        setAudioMessageDuration((prev) => prev + 1);
      }, 1000);

      mediaRecorder.current.onstop = () => {
        if (audioMessageDurationRef.current < 1) {
          handleResetAudioMessage();
          clearTimeout(timer);

          return;
        }
        const recordedBlob = new Blob(chunks.current, { type: "audio/mp3" });

        const url = URL.createObjectURL(recordedBlob);
        setAudioMessageURL(url);
        setAudioMessageFile(recordedBlob);
        chunks.current = [];
        clearTimeout(timer);
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopRecording = () => {
    setRecordBtnPosition(0);

    setIsAudioRecording(false);
    setIsHolding(false);
    setIsLocked(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach((track) => track.stop());
    }
  };

  const handleResetAudioMessage = () => {
    setAudioMessageURL(null);
    chunks.current = [];
    setAudioMessageDuration(0);
    setIsAudioRecording(false);
    setAudioMessageFile(null);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach((track) => track.stop());
    }
    mediaStream.current = null;
    mediaRecorder.current = null;
  };
  // const handleRecordButtonClick = () => {
  //   if (isAudioRecording) {
  //     handleStopRecording();
  //   } else {
  //     handleStartRecording();
  //   }
  // };

  const handleClearMessage = () => {
    handleResetIsEditingMessage();
    setMessageImageFile(null);
    setMessageText("");
    setMessageImagePreview("");
    handleResetAudioMessage();
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
    if (!messageText?.trim() && !messageImagePreview && !audioMessageURL) {
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
        isAudioMessage: !!audioMessageURL,
        audioMessage: audioMessageURL ? audioMessageURL : undefined,
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
      if (audioMessageFile) {
        formData.append("audioMessage", audioMessageFile);
      } else {
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
    audioMessageDurationRef.current = audioMessageDuration;
  }, [audioMessageDuration]);
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
      } ${(isAudioRecording || audioMessageURL) && "h-14"}`}
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

      <div className={`flex w-full  items-center  `}>
        {(isAudioRecording || audioMessageURL) && (
          <>
            <div
              className={`flex w-full items-center gap-2 ${
                isAudioRecording
                  ? "justify-between"
                  : "justify-between md:justify-around"
              }`}
            >
              {isAudioRecording ? (
                <>
                  <div className=" flex justify-center items-center">
                    <div className="h-3 w-3 rounded-full bg-red-100 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <BorderedButton
                      type="button"
                      onClick={handleResetAudioMessage}
                    >
                      <FaTrashAlt className="text-xl text-red-100 text-center" />
                    </BorderedButton>
                  </div>
                </>
              )}
              {!isAudioRecording && audioMessageURL && (
                <AudioMessagePreview src={audioMessageURL} />
              )}
              {isAudioRecording && !audioMessageURL && (
                <div className="font-semibold select-none">
                  {formatTime(audioMessageDuration)}
                </div>
              )}
            </div>
          </>
        )}
        {!isAudioRecording && !audioMessageURL && (
          <>
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
          </>
        )}
        {!isAudioRecording && (
          <div>
            <BorderedButton
              type="submit"
              className="text-xl hover:outline-none"
            >
              {isMessageEdit ? <FaCheck /> : <TbSend2 />}
            </BorderedButton>
          </div>
        )}

        <div>
          {!audioMessageURL && (
            <BorderedButton
              type="button"
              onMouseDown={handleRecordHoldStart}
              onMouseUp={handleRecordHoldEnd}
              onTouchStart={handleRecordHoldStart}
              onTouchEnd={handleRecordHoldEnd}
              onMouseMove={handleRecordHoldMove}
              onTouchMove={handleRecordHoldMove}
              onTouchCancel={handleRecordHoldEnd}
              onClick={handleLockedStop}
              className={`text-xl hover:outline-none relative    bg-gray-350 transition-transform duration-300  p-2  ${
                isHolding && "animate-pulse"
              }`}
              style={{
                transition: "0.3s",
                translate: `0 ${recordBtnPosition}px`,
              }}
            >
              <FaRegStopCircle
                className={`absolute   top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  inset-0 transition-opacity ${
                  !isLocked && isHolding ? "opacity-100" : "opacity-0"
                }`}
              />
              <FaLock
                className={`absolute   top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2  inset-0 transition-opacity ${
                  isLocked ? "opacity-100" : "opacity-0"
                }`}
              />
              <HiOutlineMicrophone
                className={`transition-opacity ${
                  isLocked || isHolding ? "opacity-0" : "opacity-100"
                }`}
              />
            </BorderedButton>
          )}
        </div>
      </div>
    </form>
  );
};

export default MessageForm;
