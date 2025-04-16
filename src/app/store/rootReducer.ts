import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import { currentConversationReducer } from "../../entities/conversation/model/";
import {
  contactsListReducer,
  currentUserReducer,
} from "../../entities/user/model/";
export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,
  contactsList: contactsListReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});
