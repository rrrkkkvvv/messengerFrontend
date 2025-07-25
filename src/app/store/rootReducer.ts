import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import { currentConversationReducer } from "../../entities/conversation/model/";
import currentUserReducer from "../../entities/user/model/userSlice";
import contactsListReducer from "../../entities/contact/model/contactSlice";

export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,
  contactsList: contactsListReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});
