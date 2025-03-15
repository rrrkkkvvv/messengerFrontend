import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import { currentConversationReducer } from "../../entities/conversation/model/";
import {
  currentUserReducer,
  getUsersReducer,
} from "../../entities/user/model/";
export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,
  getUsers: getUsersReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});
