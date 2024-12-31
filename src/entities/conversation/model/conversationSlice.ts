import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TMessageInfo } from "../api/conversationTypes";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";

interface ICurrentConversationSliceProps {
  members: TUserInfo[] | null;
  messages: TMessageInfo[] | null;
  conversationId: number | null;
  status: "exists" | "absent";
}

const initialState: ICurrentConversationSliceProps = {
  members: null,
  messages: null,
  conversationId: null,
  status: "exists",
};

const currentConversationSlice = createSlice({
  name: "currentConversation",
  initialState,
  reducers: {
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
      action: PayloadAction<{ conversationId: number | null }>
    ) {
      state.conversationId = action.payload.conversationId;
    },
  },
  selectors: {
    selectCurrentConversationMessages: (state) => state.messages,
    selectCurrentConversationMembers: (state) => state.members,
    selectCurrentConversationId: (state) => state.conversationId,
    selectCurrentConversationStatus: (state) => state.status,
  },
});

const {
  setCurrentConversationMembersState,
  setCurrentConversationMessagesState,
  setCurrentConversationIdState,
  setCurrentConversationStatusState,
} = currentConversationSlice.actions;

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
  (conversationId: string | number | null, { dispatch }) => {
    if (conversationId) {
      if (typeof conversationId == "string") {
        dispatch(
          setCurrentConversationIdState({
            conversationId: parseInt(conversationId),
          })
        );
      } else {
        dispatch(
          setCurrentConversationIdState({ conversationId: conversationId })
        );
      }
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

export const {
  selectCurrentConversationMembers,
  selectCurrentConversationMessages,
  selectCurrentConversationId,
  selectCurrentConversationStatus,
} = currentConversationSlice.selectors;
const currentConversationReducer = currentConversationSlice.reducer;
export default currentConversationReducer;
