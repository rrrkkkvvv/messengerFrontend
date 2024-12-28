import { combineReducers } from "@reduxjs/toolkit";
import baseApi from "../api/baseApi";
import { currentUserReducer } from "../../entities/user";
import currentConversationReducer from "../../entities/conversation/model/conversationSlice";
import getUsersReducer from "../../widgets/UsersList/model/getUsersSlice";
export const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentConversation: currentConversationReducer,
  getUsers: getUsersReducer,

  [baseApi.reducerPath]: baseApi.reducer,
});
