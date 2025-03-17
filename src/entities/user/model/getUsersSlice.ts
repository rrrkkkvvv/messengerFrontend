import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../../app/store/store";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";
import { TMessageInfo } from "../../conversation/api/conversationTypes";

interface IGetUsersSliceProps {
  usersList: TUserInfo[] | null;
  usersOnlineEmails: string[] | null;
}

const initialState: IGetUsersSliceProps = {
  usersList: null,
  usersOnlineEmails: null,
};
const getUsersSlice = createSlice({
  name: "getUsers",
  initialState,
  reducers: {
    setUsersListsState: (state, action: PayloadAction<TUserInfo[] | null>) => {
      state.usersList = action.payload;
    },
    setUsersOnlineEmailsState: (
      state,
      action: PayloadAction<string[] | null>
    ) => {
      state.usersOnlineEmails = action.payload;
    },
  },
  selectors: {
    selectUsersList: (state) => state.usersList,
    selectUsersOnlineEmails: (state) => state.usersOnlineEmails,
  },
});

const { setUsersListsState, setUsersOnlineEmailsState } = getUsersSlice.actions;

export const changeLastMessage =
  // TODO: MISTAKE MISTAKE MISTAKE MISTAKE!!!!!!!

    (conversationId: string, newLastMessage: TMessageInfo) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
      const currentUsersList = getState().getUsers.usersList;
      // Replace lastMessage to new for users with passed conversationId
      const newUsersList = currentUsersList
        ? currentUsersList.map((user) => {
            if (user.lastMessage?.conversationId === conversationId) {
              return { ...user, lastMessage: newLastMessage };
            } else {
              return user;
            }
          })
        : null;

      dispatch(setUsersListsState(newUsersList));
    };
export const setUsersList =
  (usersList: TUserInfo[] | null) => async (dispatch: AppDispatch) => {
    dispatch(setUsersListsState(usersList));
  };
export const setUsersOnlineEmails =
  (usersOnlineEmails: string[] | null) => async (dispatch: AppDispatch) => {
    dispatch(setUsersOnlineEmailsState(usersOnlineEmails));
  };

export const { selectUsersList, selectUsersOnlineEmails } =
  getUsersSlice.selectors;
const getUsersReducer = getUsersSlice.reducer;
export default getUsersReducer;
