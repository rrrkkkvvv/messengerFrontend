import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { FaArrowLeft } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";

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

import { selectCurrentUser } from "../user";
import { useCallback, useEffect, useState } from "react";
import { routes } from "../../shared/values/strValues";
import Avatar from "../../shared/ui/Avatar/Avatar";
import {
  useConnectToChatChanelQuery,
  useDeleteMessageMutation,
  useInvalidateConversationMutation,
} from "./api/conversationApi";
import MessageList from "./ui/Messages/MessageList";
import SidebarMenu from "./ui/SidebarMenu";
import ConversationPlaceholder from "./ui/ConversationPlaceholder";
import { TMessageInfo } from "./api/conversationTypes";
import { selectUsersOnlineEmails } from "../user/model/getUsersSlice";
import MessageForm from "./ui/MessageForm/MessageForm";

const Conversation = () => {
  const { anotherUserIdParam } = useParams();

  const currentUser = useAppSelector(selectCurrentUser);

  const conversationStatus = useAppSelector(selectCurrentConversationStatus);
  const conversationId = useAppSelector(selectCurrentConversationId);
  const conversationMembers = useAppSelector(selectCurrentConversationMembers);
  const conversationMessages = useAppSelector(
    selectCurrentConversationMessages
  );
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteMessage] = useDeleteMessageMutation();

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
  } = useConnectToChatChanelQuery({ member_ids: member_ids() });
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

  const handleDeleteMessage = async (messageId: number) => {
    if (!conversationId) return;
    try {
      await deleteMessage({
        messageId: messageId,
        conversationId: conversationId,
      }).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const handleCloseSidebarMenu = () => {
    setIsSidebarMenuVisible(false);
  };

  const handleInvalidateConversation = async () => {
    try {
      await invalidateConversation().unwrap();
    } catch (error) {
      console.error("Failed to invalidate conversation:", error);
    }
  };
  const handleSetEditingMessage = (message: TMessageInfo) => {
    setIsMessageEdit(true);
    setEditingMessage(message);
  };
  const handleToggleIsMessageEdit = () => {
    setIsMessageEdit((prev) => !prev);
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

  if (!currentUser) {
    return <ConversationPlaceholder />;
  }

  return (
    <>
      {!anotherUser() ? (
        <ConversationPlaceholder />
      ) : (
        <div className="flex flex-col w-dvw h-dvh overflow-hidden md:w-3/5  relative text-white">
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
                picture={anotherUser()?.picture}
                isOnline={isAnotherUserOnline()}
              />
              {anotherUser()?.name}
            </div>
            <div className="">
              <button
                type="button"
                onClick={() => setIsSidebarMenuVisible(true)}
                className="text-green-400 mx-2 p-2 rounded-full outline-none  text-3xl  transition-all   hover:outline-green-200"
              >
                <HiDotsHorizontal />
              </button>
            </div>
          </h1>

          {/* MESSAGES */}
          <MessageList
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleSetEditingMessage}
            currentUser={currentUser}
            conversationMessages={conversationMessages}
          />

          {/* INPUT MESSAGE */}
          <MessageForm
            handleToggleIsMessageEdit={handleToggleIsMessageEdit}
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
