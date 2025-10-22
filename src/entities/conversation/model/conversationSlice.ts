import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMessageInfo } from "../api/conversationTypes";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { AppDispatch, RootState } from "../../../app/store/store";
import { TGroupConversation } from "../../../shared/types/Contact";

interface ICurrentConversationSliceProps {
  members: TUserInfo[] | null;
  messages: TMessageInfo[] | null;
  conversationId: string | null;
  status: "exists" | "absent";
  name: string | null;
  creatorId: string | null;
  avatarURL: string | null;
}

const initialState: ICurrentConversationSliceProps = {
  members: null,
  messages: null,
  conversationId: null,
  avatarURL: null,
  name: null,
  creatorId: null,
  status: "exists",
};

const currentConversationSlice = createSlice({
  name: "currentConversation",
  initialState,
  reducers: {
    resetCurrentConversationState(state) {
      state.conversationId = null;
      state.members = null;
      state.messages = null;
      state.creatorId = null;
      state.name = null;
      state.avatarURL = null;
    },

    setCurrentConversationStatusState(
      state,
      action: PayloadAction<{ newStatus: "exists" | "absent" }>
    ) {
      state.status = action.payload.newStatus;
    },
    setCurrentConversationMessagesState(
      state,
      action: PayloadAction<{ messages: TMessageInfo[] | null }>
    ) {
      state.messages = action.payload.messages;
    },
    setCurrentConversationMembersState(
      state,
      action: PayloadAction<{ members: TUserInfo[] | null }>
    ) {
      state.members = action.payload.members;
    },
    setCurrentConversationIdState(
      state,
      action: PayloadAction<{ conversationId: string | null }>
    ) {
      state.conversationId = action.payload.conversationId;
    },
    setCurrentConversationGroupInfoState(
      state,
      action: PayloadAction<{
        avatarURL?: string | null;
        creatorId: string | null;
        name?: string | null;
      }>
    ) {
      if (typeof action.payload.avatarURL !== "undefined") {
        state.avatarURL = action.payload.avatarURL;
      }
      if (typeof action.payload.name !== "undefined") {
        state.name = action.payload.name;
      }
      state.creatorId = action.payload.creatorId;
    },
  },
  selectors: {
    selectCurrentConversationMessages: (state) => state.messages,
    selectCurrentConversationMembers: (state) => state.members,
    selectCurrentConversationId: (state) => state.conversationId,
    selectCurrentConversationStatus: (state) => state.status,
    selectCurrentConversationAvatarURL: (state) => state.avatarURL,
    selectCurrentConversationCreatorId: (state) => state.creatorId,
    selectCurrentConversationName: (state) => state.name,
  },
});

const {
  setCurrentConversationMembersState,
  setCurrentConversationMessagesState,
  setCurrentConversationIdState,
  setCurrentConversationStatusState,
  setCurrentConversationGroupInfoState,
} = currentConversationSlice.actions;
export const { resetCurrentConversationState } =
  currentConversationSlice.actions;
export const setCurrentConversationMessages = createAsyncThunk(
  "setCurrentConversationMessages",
  (messages: TMessageInfo[] | null, { dispatch }) => {
    if (messages && Array.isArray(messages)) {
      dispatch(setCurrentConversationMessagesState({ messages: messages }));
    } else {
      dispatch(setCurrentConversationMessagesState({ messages: null }));
    }
  }
);
type TSetCurrentConversationGroupInfoArgs = {
  avatarURL: string | null;
  creatorId: string | null;
  name: string | null;
};

export const setCurrentConversationGroupInfo = createAsyncThunk(
  "setCurrentConversationGroupInfo",
  (
    { avatarURL, creatorId, name }: TSetCurrentConversationGroupInfoArgs,
    { dispatch }
  ) => {
    dispatch(
      setCurrentConversationGroupInfoState({ avatarURL, creatorId, name })
    );
  }
);
export const setCurrentConversationMembers = createAsyncThunk(
  "setCurrentConversationMembers",
  (members: TUserInfo[] | null, { dispatch }) => {
    if (members && Array.isArray(members)) {
      dispatch(setCurrentConversationMembersState({ members: members }));
    } else {
      dispatch(setCurrentConversationMembersState({ members: null }));
    }
  }
);
export const setCurrentConversationId = createAsyncThunk(
  "setCurrentConversationId",
  (conversationId: string | null, { dispatch }) => {
    if (conversationId) {
      dispatch(setCurrentConversationIdState({ conversationId }));
    } else {
      dispatch(setCurrentConversationIdState({ conversationId: null }));
    }
  }
);
export const resetCurrentConversation = () => async (dispatch: AppDispatch) => {
  dispatch(resetCurrentConversationState());

  dispatch(setCurrentConversationStatusState({ newStatus: "absent" }));
};

export const setCurrentConversationExists = createAsyncThunk(
  "setCurrentConversationExists",
  (_, { dispatch }) => {
    dispatch(setCurrentConversationStatusState({ newStatus: "exists" }));
  }
);
export const updateUserInfoInConversation =
  (updatedUser: TUserInfo) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      currentConversation: { members },
    } = getState();
    if (!members) return;
    const newMembersList = members.map((member) => {
      if (member._id === updatedUser._id) {
        return {
          ...member,
          ...updatedUser,
        };
      }
      return member;
    });
    dispatch(setCurrentConversationMembers(newMembersList));
  };
export const updateCurrentConversationInfo =
  (groupConversationInfo: TGroupConversation) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentConversation } = getState();
    if (currentConversation.conversationId !== groupConversationInfo._id)
      return;
    dispatch(setCurrentConversationGroupInfo(groupConversationInfo));
  };
export const kickUserFromCurrentConversation =
  (conversationId: string, kickedUserId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      currentConversation,
      currentUser: { currentUser },
    } = getState();
    if (currentConversation.conversationId !== conversationId) return;
    if (!currentConversation.members) return;

    if (kickedUserId === currentUser?._id) {
      dispatch(resetCurrentConversation());
    }
    const newCurrentConversationMembers = currentConversation.members.filter(
      (member) => member._id !== kickedUserId
    );
    dispatch(setCurrentConversationMembers(newCurrentConversationMembers));
  };
export const addUsersToCurrentConversation =
  (conversationId: string, users: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      currentConversation,
      contactsList: { contactsList },
    } = getState();
    if (currentConversation.conversationId !== conversationId) return;
    if (!currentConversation.members) return;
    if (!contactsList) return;

    const newCurrentConversationMembers = [...currentConversation.members];
    users.forEach((userId) => {
      const user = contactsList.find((contact) => contact._id === userId);
      if (user && user.type === "single") {
        newCurrentConversationMembers.push(user);
      }
    });
    dispatch(setCurrentConversationMembers(newCurrentConversationMembers));
  };
export const changeConversationUserTypingStatus =
  (conversationId: string, userId: string, typingStatus: boolean) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentConversation } = getState();
    if (currentConversation.conversationId !== conversationId) return;
    const membersList = currentConversation.members;
    const newMembersList = membersList
      ? membersList.map((user) => {
          if (user._id !== userId) return user;
          return {
            ...user,
            isTyping: typingStatus,
          };
        })
      : null;

    dispatch(setCurrentConversationMembers(newMembersList));
  };
export const newMessage =
  (sendedMessage: TMessageInfo) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentConversation } = getState();
    if (currentConversation.conversationId !== sendedMessage.conversationId)
      return;
    const messages = currentConversation.messages?.length
      ? [...currentConversation.messages, sendedMessage]
      : [sendedMessage];
    dispatch(setCurrentConversationMessages(messages));
  };
export const updateMessage =
  ({ updatedMessage }: { updatedMessage: TMessageInfo }) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentConversation } = getState();
    if (
      currentConversation.conversationId !== updatedMessage.conversationId ||
      !currentConversation.messages
    )
      return;
    const messages = currentConversation.messages.map((message) => {
      if (
        message._id === updatedMessage._id ||
        (message.pendingId &&
          updatedMessage.pendingId &&
          message.pendingId === updatedMessage.pendingId)
      ) {
        return {
          ...updatedMessage,
        };
      }
      return message;
    });
    dispatch(setCurrentConversationMessages(messages));
  };
export const {
  selectCurrentConversationMembers,
  selectCurrentConversationMessages,
  selectCurrentConversationId,
  selectCurrentConversationStatus,
  selectCurrentConversationAvatarURL,
  selectCurrentConversationCreatorId,
  selectCurrentConversationName,
} = currentConversationSlice.selectors;
const currentConversationReducer = currentConversationSlice.reducer;
export default currentConversationReducer;
