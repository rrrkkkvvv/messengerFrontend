import { MouseEvent, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";

import { formatTime } from "../../../../shared/utils/formatTime";
import MessageBox from "./MessageBox";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";
import { useDeleteMessageMutation } from "../../../../entities/conversation";
import { TMessageInfo } from "../../../../shared/types/messageTypes";

interface IMessageListProps {
  conversationId: string | null;
  conversationMessages: TMessageInfo[] | null;
  currentUser: TUserInfo | null;
  onEditMessage: (message: TMessageInfo) => void;
  isGroup: boolean;
}

const MessageList = ({
  conversationId,
  conversationMessages,
  currentUser,
  onEditMessage,
  isGroup,
}: IMessageListProps) => {
  const [downScrollVisible, setDownScrollVisible] = useState<boolean>(true);
  const [deleteMessage] = useDeleteMessageMutation();
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    backgroundColor: string;
    message: TMessageInfo | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    backgroundColor: "",
    message: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleScrollDown = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      setDownScrollVisible(false);
    }
  };
  const handleContextMenu = (
    event: MouseEvent,
    message: TMessageInfo,
    backgroundColor: string
  ) => {
    event.preventDefault();

    if (messagesEndRef.current) {
      const rect = messagesEndRef.current.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const menuWidth = 150;
      const menuHeight = 50;

      const adjustedX = Math.min(x, rect.width - menuWidth);
      const adjustedY = Math.min(y, rect.height - menuHeight);

      setContextMenu({
        visible: true,
        x: adjustedX,
        y: adjustedY,
        backgroundColor,
        message,
      });
    }
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      backgroundColor: "",
      message: null,
    });
  };
  const handleDelete = async () => {
    if (!conversationId) return;
    if (contextMenu.message?._id) {
      try {
        await deleteMessage({
          conversationId,
          messageId: contextMenu.message._id,
        }).unwrap();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
    closeContextMenu();
  };
  const handleEdit = () => {
    if (contextMenu.message) {
      onEditMessage(contextMenu.message);
    }
    closeContextMenu();
  };
  const handleScroll = () => {
    let messageContainer = messagesEndRef.current;
    if (!messageContainer) return;

    const isAtBottom =
      messageContainer.scrollHeight - messageContainer.scrollTop ===
      messageContainer.clientHeight;

    const isScrollingUp =
      messageContainer.scrollTop <
      messageContainer.scrollHeight - messageContainer.clientHeight;

    setDownScrollVisible(isScrollingUp && !isAtBottom);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.classList.remove("scroll-smooth");
      handleScrollDown();
      messagesEndRef.current?.classList.add("scroll-smooth");
    }
  }, [conversationMessages?.length]);

  useEffect(() => {
    const scrollElement = messagesEndRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [downScrollVisible]);

  return (
    <>
      <div
        ref={messagesEndRef}
        onClick={closeContextMenu}
        className={`flex h-dvh flex-col  scroll-smooth  bg-gray-400 text-2xl  relative text-center border-2 border-gray-200  ${
          contextMenu.visible ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
      >
        {currentUser &&
          conversationId &&
          conversationMessages?.map((message) => {
            return (
              <MessageBox
                key={message._id}
                isGroup={isGroup}
                currentUser={currentUser}
                conversationId={conversationId}
                message={message}
                handleContextMenu={handleContextMenu}
              />
            );
          })}
        <div
          onClick={handleScrollDown}
          className={`text-gray-50 transition bottom-16 duration-300 flex fixed text-5xl right-0 px-4 justify-center z-20 ${
            downScrollVisible ? " " : "opacity-0 translate-y-20 -z-0"
          }`}
        >
          <FaArrowAltCircleDown className="cursor-pointer bg-gray-400 box-content rounded-full" />
        </div>
      </div>
      {/* Context menu */}
      {contextMenu.visible && (
        <div
          className={`absolute border rounded-xl shadow-md z-50 bg-gray-200`}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          {contextMenu.message?.sentAt && (
            <div className="block px-4 py-4 w-full rounded-xl text-gray-50 ">
              Sent at {formatTime(contextMenu.message.sentAt)}
            </div>
          )}
          {!contextMenu.message?.isCallInfo &&
            contextMenu.message?.editedAt && (
              <div className="block px-4 py-4 w-full rounded-xl text-gray-50 ">
                Edited at {formatTime(contextMenu.message.editedAt)}
              </div>
            )}

          {contextMenu.message?.senderId === currentUser?._id && (
            <>
              <button
                onClick={handleDelete}
                className="block px-4 py-4 w-full rounded-xl text-gray-50 transition duration-300 hover:bg-gray-300"
              >
                Delete message
              </button>
              <button
                onClick={handleEdit}
                className="block px-4 py-4  w-full rounded-xl text-gray-50 transition duration-300 hover:bg-gray-300"
              >
                Edit message
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessageList;
