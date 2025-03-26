import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { FaArrowLeft } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaCircle } from "react-icons/fa6";

import {
  selectCurrentConversationId,
  selectCurrentConversationMembers,
  selectCurrentConversationMessages,
  selectCurrentConversationStatus,
  setCurrentConversationExists,
  setCurrentConversationId,
  setCurrentConversationMembers,
  setCurrentConversationMessages,
} from "../model";

import { useCallback, useEffect, useState } from "react";
import { routes } from "../../../shared/values/strValues";
import Avatar from "../../../shared/ui/Avatar/Avatar";
import {
  useConnectToChatChanelQuery,
  useDeleteMessageMutation,
  useInvalidateConversationMutation,
} from "../api";
import MessageList from "./Messages/MessageList";
import SidebarMenu from "./SidebarMenu";
import ConversationPlaceholder from "./ConversationPlaceholder";
import { TMessageInfo } from "../api/conversationTypes";
import { selectUsersOnlineEmails } from "../../user/model";
import MessageForm from "./MessageForm/MessageForm";
import { selectCurrentUser } from "../../user/model";
import { IoCloseOutline } from "react-icons/io5";
import { resetCurrentConversation } from "../model/conversationSlice";
import { useLeaveConversationConnectMutation } from "../api/conversationApi";

const Conversation = () => {
  const { anotherUserIdParam } = useParams();
  const location = useLocation();

  const currentUser = useAppSelector(selectCurrentUser);

  const conversationStatus = useAppSelector(selectCurrentConversationStatus);
  const conversationId = useAppSelector(selectCurrentConversationId);
  const conversationMembers = useAppSelector(selectCurrentConversationMembers);
  const conversationMessages = useAppSelector(
    selectCurrentConversationMessages
  );
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);
  const [leaveConversationConn] = useLeaveConversationConnectMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteMessage] = useDeleteMessageMutation();

  //USE CALLBACKS

  const anotherUser = useCallback(() => {
    if (currentUser && conversationMembers) {
      return conversationMembers.find(
        (member) => member._id !== currentUser._id
      );
    } else {
      return null;
    }
  }, [conversationMembers, currentUser?._id]);

  const isAnotherUserOnline = useCallback(() => {
    const anotherUserData = anotherUser();
    if (usersOnlineEmails && anotherUserData) {
      return usersOnlineEmails.includes(anotherUserData.email);
    } else {
      return false;
    }
  }, [usersOnlineEmails, anotherUser]);

  // Chat connection
  const {
    data: chatData = {
      messages: null,
      members: null,
      conversationId: null,
    },
  } = useConnectToChatChanelQuery({
    userId: anotherUserIdParam || null,
  });
  const [invalidateConversation] = useInvalidateConversationMutation();

  // STATES
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TMessageInfo | null>(
    null
  );

  // Is mobile device flag
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isSidebarMenuVisible, setIsSidebarMenuVisible] = useState(false);

  // HANDLES FUNCTIONS
  const closeConversation = async () => {
    if (!conversationId) return;
    await leaveConversationConn(conversationId).unwrap();
    dispatch(resetCurrentConversation());
    navigate(routes.main);
  };
  // Function for redirecting to current conversation route if user is on another page, but clicked on convesation field
  // MUST HAVE, because of it gives reconect to WS
  const redirectToCurrentConversation = () => {
    if (!location.pathname.startsWith("/conversation/")) {
      let anotherUserData = anotherUser();
      if (anotherUserData) {
        navigate("/conversation/" + anotherUserData._id);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!conversationId) return;
    try {
      await deleteMessage({
        conversationId,
        messageId,
      }).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const handleCloseSidebarMenu = () => {
    setIsSidebarMenuVisible(false);
    setEditingMessage(null);
  };

  const handleInvalidateConversation = async () => {
    try {
      await invalidateConversation().unwrap();
    } catch (error) {
      console.error("Failed to invalidate conversation:", error);
    }
  };
  const handleSetEditingMessageData = (message: TMessageInfo) => {
    setIsMessageEdit(true);
    setEditingMessage(message);
  };
  const handleResetIsEditingMessage = () => {
    setIsMessageEdit(false);
  };

  //USE EFFECTS
  useEffect(() => {
    if (conversationStatus == "absent") {
      navigate(routes.main);
      dispatch(setCurrentConversationExists());
    }
  }, [conversationStatus]);
  useEffect(() => {
    // Resize of window if there is mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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

  return (
    <>
      {!anotherUser() ? (
        <ConversationPlaceholder />
      ) : (
        <div
          className="flex flex-col w-dvw h-dvh overflow-hidden md:w-3/5  relative text-white"
          onClick={redirectToCurrentConversation}
        >
          {/* HEADER */}
          <h1 className="flex px-5  border border-gray-200  w-full z-10  items-center justify-between h-20 bg-gray-200">
            {isMobile && (
              <button
                type="button"
                className="text-green-400 mx-2 p-2 text-2xl rounded-full outline-none  transition-all focus:outline-green-400 hover:outline-green-200"
                onClick={() => {
                  navigate(routes.main);
                }}
              >
                <FaArrowLeft />
              </button>
            )}
            <div className="flex flex-row scale-125 md:scale-100 items-center gap-5">
              <Avatar
                isProfileAvatar={false}
                picture={anotherUser()?.avatarURL}
                isOnline={isAnotherUserOnline()}
              />
              <div className="flex flex-col ">
                <div className="text-lg">{anotherUser()?.name}</div>
                {/* anotherUser()?.isTyping */}
                {anotherUser()?.isTyping && (
                  <div className="text-green-150 select-none  flex items-center  ">
                    <span className="text-lg">is typing</span>
                    <div className="flex gap-0.5  pt-4">
                      <FaCircle className="h-1 w-1 duration-100 animate-bounce" />
                      <FaCircle className="h-1 w-1 duration-200 animate-bounce" />
                      <FaCircle className="h-1  w-1 duration-300 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="">
              <button
                type="button"
                onClick={() => setIsSidebarMenuVisible(true)}
                className="text-green-400 mx-2 p-2 rounded-full outline-none  text-3xl  transition-all   hover:outline-green-200"
              >
                <HiDotsHorizontal />
              </button>
              {!isMobile && (
                <button
                  type="button"
                  onClick={closeConversation}
                  className="text-green-400 mx-2 p-2 rounded-full outline-none  text-3xl  transition-all   hover:outline-green-200"
                >
                  <IoCloseOutline />
                </button>
              )}
            </div>
          </h1>

          {/* MESSAGES */}
          <MessageList
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleSetEditingMessageData}
            currentUser={currentUser}
            conversationId={conversationId}
            conversationMessages={conversationMessages}
          />

          {/* INPUT MESSAGE */}
          <MessageForm
            handleResetIsEditingMessage={handleResetIsEditingMessage}
            currentUser={currentUser}
            conversationId={conversationId}
            isMessageEdit={isMessageEdit}
            editingMessage={editingMessage}
          />

          <SidebarMenu
            isAnotherUserOnline={isAnotherUserOnline()}
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
