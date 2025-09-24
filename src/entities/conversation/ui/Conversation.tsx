import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";

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
import {
  useConnectToChatChanelQuery,
  useInvalidateConversationMutation,
} from "../api";
import MessageList from "./Messages/MessageList";
import SidebarMenu from "./Sidebar/SidebarMenu";
import ConversationPlaceholder from "./ConversationPlaceholder";
import { TMessageInfo } from "../api/conversationTypes";
import MessageForm from "./MessageForm/MessageForm";
import {
  selectCurrentConversationAvatarURL,
  selectCurrentConversationCreatorId,
  selectCurrentConversationName,
  setCurrentConversationGroupInfo,
} from "../model/conversationSlice";
import { selectUsersOnlineEmails } from "../../contact/model/contactSlice";
import { selectCurrentUser } from "../../user";
import ConversationSkeleton from "./ConversationSkeleton";
import ConversationHeader from "./ConversationHeader";

const Conversation = () => {
  const { type: conversationType, contactId } = useParams();

  const location = useLocation();

  const currentUser = useAppSelector(selectCurrentUser);
  const conversationStatus = useAppSelector(selectCurrentConversationStatus);

  const conversationName = useAppSelector(selectCurrentConversationName);
  const conversationAvatarURL = useAppSelector(
    selectCurrentConversationAvatarURL
  );
  const conversationCreatorId = useAppSelector(
    selectCurrentConversationCreatorId
  );

  const conversationId = useAppSelector(selectCurrentConversationId);
  const conversationMembers = useAppSelector(selectCurrentConversationMembers);
  const conversationMessages = useAppSelector(
    selectCurrentConversationMessages
  );
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      avatarURL: null,
      creatorId: null,
      name: null,
    },
  } = useConnectToChatChanelQuery(
    conversationType === "single"
      ? {
          userId: contactId,
          isGroup: false,
        }
      : {
          conversationId: contactId,
          isGroup: true,
        }
  );
  const [invalidateConversation] = useInvalidateConversationMutation();

  // STATES
  const [isMessageEdit, setIsMessageEdit] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TMessageInfo | null>(
    null
  );

  // Is mobile device flag

  const [isSidebarMenuVisible, setIsSidebarMenuVisible] = useState(false);
  const handleShowSidebarMenu = () => {
    setIsSidebarMenuVisible(true);
  };
  // HANDLES FUNCTIONS

  // Function for redirecting to current conversation route if user is on another page, but clicked on convesation field
  // MUST HAVE, because of it gives reconect to WS
  const redirectToCurrentConversation = () => {
    if (!location.pathname.startsWith("/conversation")) {
      navigate(
        `conversation/${conversationCreatorId ? "group" : "single"}/${
          conversationCreatorId ? conversationId : anotherUser()?._id
        }`
      );
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
  useEffect(() => {
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
      dispatch(
        setCurrentConversationGroupInfo({
          avatarURL: chatData.avatarURL ? chatData.avatarURL : null,
          creatorId: chatData.creatorId,
          name: chatData.name,
        })
      );

      dispatch(setCurrentConversationMembers(chatData.members));
      dispatch(setCurrentConversationId(chatData.conversationId));
    }
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

  if (!anotherUser() && !conversationName && !conversationType && !contactId) {
    return <ConversationPlaceholder />;
  } else if (
    !anotherUser() &&
    !conversationName &&
    conversationType &&
    contactId
  ) {
    return <ConversationSkeleton />;
  }
  return (
    <>
      <div
        className="flex flex-col w-dvw h-dvh overflow-hidden md:w-3/5  relative text-white"
        onClick={redirectToCurrentConversation}
      >
        {/* HEADER */}
        <ConversationHeader
          anotherUser={anotherUser()}
          conversationAvatarURL={conversationAvatarURL}
          conversationCreatorId={conversationCreatorId}
          conversationId={conversationId}
          conversationMembers={conversationMembers}
          conversationName={conversationName}
          isAnotherUserOnline={isAnotherUserOnline()}
          handleShowSidebarMenu={handleShowSidebarMenu}
        />
        <MessageList
          isGroup={!!conversationCreatorId}
          onEditMessage={handleSetEditingMessageData}
          currentUser={currentUser}
          conversationId={conversationId}
          conversationMessages={conversationMessages}
        />

        <MessageForm
          handleResetIsEditingMessage={handleResetIsEditingMessage}
          currentUser={currentUser}
          conversationId={conversationId}
          isMessageEdit={isMessageEdit}
          editingMessage={editingMessage}
        />
        {/* TEST CALL */}
        {/* {anotherUser() && (
          <Call callTo={anotherUser()?._id} currentUser={currentUser} />
        )} */}

        <SidebarMenu
          avatarURL={conversationAvatarURL}
          creatorId={conversationCreatorId}
          members={conversationMembers}
          name={conversationName}
          isAnotherUserOnline={isAnotherUserOnline()}
          isSidebarMenuVisible={isSidebarMenuVisible}
          closeSidebarMenu={handleCloseSidebarMenu}
          anotherUser={anotherUser()}
          conversationId={conversationId}
          usersOnlineEmails={usersOnlineEmails}
        />
      </div>
    </>
  );
};

export default Conversation;
