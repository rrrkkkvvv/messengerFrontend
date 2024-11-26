import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import { currentUserReducer } from "../../entities/user";
import currentConversationReducer from "../../entities/conversation/model/conversationSlice";
export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});
