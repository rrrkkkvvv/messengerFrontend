import { MouseEvent, useEffect, useRef, useState } from "react";
import { TMessageInfo } from "../../api/conversationTypes";
import { FaArrowAltCircleDown } from "react-icons/fa";

import { formatTime } from "../../../../shared/utils/formatTime";
import MessageBox from "./MessageBox";
import { TUserInfo } from "../../../../shared/types/UserEntityTypes";

interface IMessageListProps {
  conversationMessages: TMessageInfo[] | null;
  currentUser: TUserInfo;
  onDeleteMessage: (messageId: number) => void;
  onEditMessage: (message: TMessageInfo) => void;
}

const MessageList = ({
  conversationMessages,
  currentUser,
  onDeleteMessage,
  onEditMessage,
}: IMessageListProps) => {
  const [downScrollVisible, setDownScrollVisible] = useState<boolean>(true);
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

  const handleDelete = () => {
    if (contextMenu.message?.message_id) {
      onDeleteMessage(contextMenu.message?.message_id);
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
  }, [conversationMessages]);

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
        className={`scroll-smooth  bg-gray-300 text-2xl h-dvh relative text-center border-2 border-gray-200  ${
          contextMenu.visible ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
      >
        <div onClick={closeContextMenu} className="relative">
          {conversationMessages?.map((message) => (
            <MessageBox
              key={message.message_id}
              currentUser={currentUser}
              message={message}
              handleContextMenu={handleContextMenu}
            />
          ))}
        </div>
        <div
          onClick={handleScrollDown}
          className={`text-green-300 transition bottom-24 duration-300 flex fixed text-5xl right-0 px-4 justify-center z-20 ${
            downScrollVisible ? " " : "opacity-0 translate-y-20 -z-0"
          }`}
        >
          <FaArrowAltCircleDown className="cursor-pointer bg-gray-300 box-content rounded-full" />
        </div>
      </div>
      {/* Context menu */}
      {contextMenu.visible && (
        <div
          className={`absolute border rounded-xl shadow-md z-50 ${contextMenu.backgroundColor}`}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          {contextMenu.message?.edited_at && (
            <div className="block px-4 py-4 w-full rounded-xl text-gray-50 ">
              Edited at {formatTime(contextMenu.message.edited_at)}
            </div>
          )}

          {contextMenu.message?.sender_name === currentUser.name && (
            <>
              <button
                onClick={handleDelete}
                className="block px-4 py-4 w-full rounded-xl text-gray-50 transition duration-300 hover:bg-green-800"
              >
                Delete message
              </button>
              <button
                onClick={handleEdit}
                className="block px-4 py-4  w-full rounded-xl text-gray-50 transition duration-300 hover:bg-green-800"
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
