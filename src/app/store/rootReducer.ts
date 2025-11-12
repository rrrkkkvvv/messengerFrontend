import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import currentUserReducer from "../../entities/user/model/userSlice";
import contactsListReducer from "../../entities/contact/model/contactSlice";
import { callReducer } from "../../entities/call/";
import { currentConversationReducer } from "../../entities/conversation";

export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,
  contactsList: contactsListReducer,
  callState: callReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
