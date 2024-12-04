import React, { useEffect, useRef, useState } from "react";
import { TUserInfo } from "../../user";
import { TMessageInfo } from "../api/conversationTypes";
import { FaArrowAltCircleDown } from "react-icons/fa";

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
  const [lastScroll, setLastScroll] = useState<number>(0);
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
      setDownScrollVisible(false);
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  const handleContextMenu = (
    event: React.MouseEvent,
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
    if (messagesEndRef.current) {
      const currentScroll = messagesEndRef.current.scrollTop;
      if (currentScroll > lastScroll && downScrollVisible) {
        setDownScrollVisible(false);
      } else if (currentScroll < lastScroll && !downScrollVisible) {
        setDownScrollVisible(true);
      }
      setLastScroll(currentScroll);
    }
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
  }, [lastScroll, downScrollVisible]);

  return (
    <>
      <div
        ref={messagesEndRef}
        className={`py-24 scroll-smooth  bg-gray-300 text-2xl h-dvh relative text-center border-2 border-gray-200 ${
          contextMenu.visible ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
      >
        <div onClick={closeContextMenu} className="relative">
          {conversationMessages?.map((message) => {
            const isCurrentUser = message.sender_name === currentUser.name;
            const backgroundColor = isCurrentUser
              ? "bg-green-700"
              : "bg-green-900";

            return (
              <div
                onContextMenu={
                  isCurrentUser
                    ? (e) => {
                        handleContextMenu(e, message, backgroundColor);
                      }
                    : () => {}
                }
                key={message.message_id}
                className={`w-full p-2 flex mb-10 relative ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`h-max text-base md:text-lg rounded-md text-left p-3 flex flex-col text-white ${backgroundColor}`}
                >
                  <span className="text-sm">
                    {isCurrentUser ? "You" : message.sender_name}
                  </span>
                  <div>
                    <span>{message.message_text && message.message_text}</span>
                    {message.message_image && (
                      <img className="max-w-52" src={message.message_image} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

      {contextMenu.visible && (
        <div
          className={`absolute border rounded-xl shadow-md z-50 ${contextMenu.backgroundColor}`}
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
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
        </div>
      )}
    </>
  );
};

export default MessageList;
