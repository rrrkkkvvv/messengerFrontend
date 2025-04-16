import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMessageInfo } from "../api/conversationTypes";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { AppDispatch, RootState } from "../../../app/store/store";

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
    resetCurrentConversation(state) {
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
        avatarURL: string | null;
        creatorId: string | null;
        name: string | null;
      }>
    ) {
      state.avatarURL = action.payload.avatarURL;
      state.creatorId = action.payload.creatorId;
      state.name = action.payload.name;
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
export const { resetCurrentConversation } = currentConversationSlice.actions;
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

export const deleteConversation = createAsyncThunk(
  "deleteConversation",
  (_, { dispatch }) => {
    dispatch(setCurrentConversationIdState({ conversationId: null }));

    dispatch(setCurrentConversationMessagesState({ messages: null }));

    dispatch(setCurrentConversationMembersState({ members: null }));
    dispatch(setCurrentConversationStatusState({ newStatus: "absent" }));
  }
);

export const setCurrentConversationExists = createAsyncThunk(
  "setCurrentConversationExists",
  (_, { dispatch }) => {
    dispatch(setCurrentConversationStatusState({ newStatus: "exists" }));
  }
);
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
