import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { FaArrowAltCircleDown, FaArrowLeft } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

import {
  selectCurrentConversationId,
  selectCurrentConversationMembers,
  selectCurrentConversationMessages,
  selectCurrentConversationStatus,
  setCurrentConversationExists,
  setCurrentConversationId,
  setCurrentConversationMembers,
  setCurrentConversationMessages,
} from "./model/conversationSlice";

import { logout, selectCurrentUser } from "../user";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { routes } from "../../shared/values/strValues";
import Avatar from "../../shared/ui/Avatar/Avatar";
import Input from "../../shared/ui/Input/Input";
import {
  useConnectToChatQuery,
  useInvalidateConversationMutation,
  useSendMessageMutation,
} from "./api/conversationApi";
import MessageList from "./ui/MessageList";
import SidebarMenu from "./ui/SidebarMenu";
import ConversationPlaceholder from "./ui/ConversationPlaceholder";
import UploadButton from "./ui/UploadImageButton";

const Conversation = () => {
  const { anotherUserIdParam } = useParams();

  const currentUser = useAppSelector(selectCurrentUser);
  const conversationStatus = useAppSelector(selectCurrentConversationStatus);
  const conversationId = useAppSelector(selectCurrentConversationId);
  const conversationMembers = useAppSelector(selectCurrentConversationMembers);
  const conversationMessages = useAppSelector(
    selectCurrentConversationMessages
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sendMessage] = useSendMessageMutation();

  //USE CALLBACKS
  const member_ids = useCallback(() => {
    if (anotherUserIdParam && currentUser) {
      return [parseInt(anotherUserIdParam), currentUser.id];
    } else {
      return null;
    }
  }, [anotherUserIdParam, currentUser?.id]);

  const anotherUser = useCallback(() => {
    if (currentUser && conversationMembers) {
      return conversationMembers.find((member) => member.id !== currentUser.id);
    } else {
      return null;
    }
  }, [conversationMembers, currentUser?.id]);

  // Chat connection
  const {
    data: chatData = {
      messages: null,
      members: null,
      conversationId: null,
    },
  } = useConnectToChatQuery({ member_ids: member_ids() });
  const [invalidateConversation] = useInvalidateConversationMutation();

  // STATES
  // Last scroll position(for calculation and scroll down)
  const [lastScroll, setLastScroll] = useState<number>(0);
  // Flag state for arrow-scroll-down
  const [downScrollVisible, setDownScrollVisible] = useState<boolean>(true);
  // Input message value
  const [message, setMessage] = useState<string | null>(null);

  const [messageImage, setMessageImage] = useState<string | null>(null);

  // Is mobile device flag
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isSidebarMenuVisible, setIsSidebarMenuVisible] = useState(false);

  //Ref of messages-elem for scrolling down
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // HANDLES FUNCTIONS
  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (!message.trim()) return;
    if (!conversationId) return;
    if (!currentUser) return;
    if (!message && !messageImage) return;
    const messageData = {
      conversationId: conversationId,
      message: { text: message, senderId: currentUser.id, image: messageImage },
    };
    console.log(messageData);
    try {
      await sendMessage(messageData).unwrap();
      setMessage(null);
      setMessageImage(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleCloseSidebarMenu = () => {
    setIsSidebarMenuVisible(false);
  };
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };
  const handleScrollDown = () => {
    if (messagesEndRef.current) {
      setDownScrollVisible(false);
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  const handleSetMessageImage = (url: string | null) => {
    setMessageImage(url);
    console.log("Uploaded image URL:", url);
  };
  // Setting visibility of arrow-scroll-down on messages-elem scroll
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
  const handleInvalidateConversation = async () => {
    try {
      await invalidateConversation().unwrap();
    } catch (error) {
      console.error("Failed to invalidate conversation:", error);
    }
  };
  //USE EFFECTS
  useEffect(() => {
    // refetch();
    if (conversationStatus == "absent") {
      navigate(routes.main);
      dispatch(setCurrentConversationExists());
    }
  }, [conversationStatus]);

  // Chat data processing(messages, members, conversationId)
  useEffect(() => {
    if (!chatData && !currentUser) return;

    // Open of websocket always returns members and conversationId
    if (chatData.members !== null) {
      dispatch(setCurrentConversationMembers(chatData.members));
      dispatch(setCurrentConversationId(chatData.conversationId));
    }
    // messages can be false, because conversation could not have messages
    if (Array.isArray(chatData.messages) && chatData.messages.length === 0) {
      dispatch(setCurrentConversationMessages(null));
    }
    if (chatData.messages) {
      dispatch(setCurrentConversationMessages(chatData.messages));
    }
    if (
      chatData.members === null &&
      chatData.messages === null &&
      chatData.conversationId === null
    ) {
      handleInvalidateConversation();
    }
  }, [chatData, currentUser, dispatch]);

  //Scorlling down on messages updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.classList.remove("scroll-smooth");

      handleScrollDown();

      messagesEndRef.current?.classList.add("scroll-smooth");
    }
  }, [conversationMessages]);

  useEffect(() => {
    // Resize of window if there is mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    //   // Scroll-down on window open/refresh
    const scrollElement = messagesEndRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", handleResize);

      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lastScroll, downScrollVisible]);

  if (!currentUser) {
    logout(navigate, dispatch);
    return;
  }

  return (
    <>
      {!anotherUser() ? (
        <ConversationPlaceholder />
      ) : (
        <div className="flex flex-col w-dvw h-dvh overflow-hidden md:w-3/5  relative text-white">
          {/* HEADER */}
          <h1 className="flex px-5 absolute border border-gray-200  w-full z-10  items-center justify-between h-20 bg-gray-200">
            {isMobile && (
              <button
                className="text-green-400 mx-2 p-2 text-2xl rounded-full outline-none outline-green-100  transition-all focus:outline-green-400 hover:outline-green-200"
                onClick={() => {
                  // window.location.href = routes.main;
                  navigate(routes.main);
                }}
              >
                <FaArrowLeft />
              </button>
            )}
            <div className="flex flex-row scale-125 md:scale-100 items-center gap-5">
              <Avatar user={anotherUser()} />
              {anotherUser()?.name}
            </div>
            <div className="">
              <button
                onClick={() => setIsSidebarMenuVisible(true)}
                className="text-green-400 mx-2 p-2 rounded-full outline-none  text-3xl  transition-all   hover:outline-green-200"
              >
                <HiDotsHorizontal />
              </button>
            </div>
          </h1>

          {/* MESSAGES */}
          <div
            ref={messagesEndRef}
            className="py-24 scroll-smooth overflow-y-auto bg-gray-300 text-2xl h-dvh relative text-center border-2 border-gray-200"
          >
            {conversationMessages && (
              <MessageList
                currentUser={currentUser}
                conversationMessages={conversationMessages}
              />
            )}
            <div
              onClick={handleScrollDown}
              className={` text-green-300  transition    bottom-24 duration-300 flex fixed text-5xl right-0  px-4 justify-center z-20 ${
                downScrollVisible ? "  " : " opacity-0 translate-y-20 -z-0"
              }`}
            >
              <FaArrowAltCircleDown className="cursor-pointer bg-gray-300 box-content rounded-full" />
            </div>
          </div>

          {/* INPUT MESSAGE */}
          <form
            onSubmit={(event) => handleSendMessage(event)}
            className={`flex flex-col absolute px-5 justify-center bottom-0 w-full z-30 gap-3 py-4 bg-gray-300 border-l-2 border-gray-200 ${
              messageImage && "border border-t-gray-200"
            }`}
          >
            {messageImage && (
              <>
                <button
                  // Clears state of message image
                  onClick={() => handleSetMessageImage(null)}
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
              <Input
                type="text"
                onClick={() => {}}
                onChange={handleInputChange}
                placeholder="Input message..."
                value={message ? message : ""}
                className="w-full hover:border"
              />
              <UploadButton onUpload={handleSetMessageImage} />
              <button
                type="submit"
                className="p-4 rounded-md outline-none transition-all border-white border focus:border-green-400 hover:border-green-400"
              >
                Send
              </button>
            </div>
          </form>

          <SidebarMenu
            isSidebarMenuVisible={isSidebarMenuVisible}
            closeSidebarMenu={handleCloseSidebarMenu}
            anotherUser={anotherUser()}
            conversationId={conversationId}
          />
        </div>
      )}
    </>
  );
};

export default Conversation;
