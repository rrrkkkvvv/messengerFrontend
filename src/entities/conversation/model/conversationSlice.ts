import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../app/store/store";
import { TMessageInfo } from "../api/conversationTypes";
import { TUserInfo } from "../../user";

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
      action: PayloadAction<"exists" | "absent">
    ) {
      state.status = action.payload;
    },
    setCurrentConversationMessagesState(
      state,
      action: PayloadAction<TMessageInfo[] | null>
    ) {
      state.messages = action.payload;
    },
    setCurrentConversationMembersState(
      state,
      action: PayloadAction<TUserInfo[] | null>
    ) {
      state.members = action.payload;
    },
    setCurrentConversationIdState(state, action: PayloadAction<number | null>) {
      state.conversationId = action.payload;
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

export const setCurrentConversationMessages =
  (messages: TMessageInfo[] | null) => async (dispatch: AppDispatch) => {
    if (messages && Array.isArray(messages)) {
      dispatch(setCurrentConversationMessagesState(messages));
    } else {
      dispatch(setCurrentConversationMessagesState(null));
    }
  };
export const setCurrentConversationMembers =
  (members: TUserInfo[] | null) => async (dispatch: AppDispatch) => {
    if (members && Array.isArray(members)) {
      dispatch(setCurrentConversationMembersState(members));
    } else {
      dispatch(setCurrentConversationMembersState(null));
    }
  };
export const setCurrentConversationId =
  (conversationId: string | number | null) => async (dispatch: AppDispatch) => {
    if (conversationId) {
      if (typeof conversationId == "string") {
        dispatch(setCurrentConversationIdState(parseInt(conversationId)));
      } else {
        dispatch(setCurrentConversationIdState(conversationId));
      }
    } else {
      dispatch(setCurrentConversationIdState(null));
    }
  };

export const deleteConversation = () => async (dispatch: AppDispatch) => {
  dispatch(setCurrentConversationIdState(null));

  dispatch(setCurrentConversationMessagesState(null));

  dispatch(setCurrentConversationMembersState(null));
  dispatch(setCurrentConversationStatusState("absent"));
};
export const setCurrentConversationExists =
  () => async (dispatch: AppDispatch) => {
    dispatch(setCurrentConversationStatusState("exists"));
  };
export const {
  selectCurrentConversationMembers,
  selectCurrentConversationMessages,
  selectCurrentConversationId,
  selectCurrentConversationStatus,
} = currentConversationSlice.selectors;
const currentConversationReducer = currentConversationSlice.reducer;
export default currentConversationReducer;
