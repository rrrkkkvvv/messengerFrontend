import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../../app/store/store";
import { TLastMessage, TUserInfo } from "../../../shared/types/UserEntityTypes";

type TUser = TUserInfo & {
  lastMessage: TLastMessage | null;
};
type TUsersList = TUser[];
interface IGetUsersSliceProps {
  usersList: TUsersList | null;
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
    setUsersListsState: (state, action: PayloadAction<TUser[] | null>) => {
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
  (
    conversationId: string,
    newLastMessage:
      | TLastMessage
      | { conversationId: number }
      | { seenStatus: boolean; conversationId: number }
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { getUsers } = getState();
    const currentUsersList = getUsers.usersList;

    // Replace lastMessage to new for users with passed conversationId
    const newUsersList = currentUsersList
      ? currentUsersList.map((user) => {
          if (user.lastMessage?.conversationId !== conversationId) return user;
          if (!("_id" in newLastMessage)) {
            return {
              ...user,
              lastMessage:
                "seenStatus" in newLastMessage
                  ? {
                      ...user.lastMessage,
                      seenStatus: newLastMessage.seenStatus,
                    }
                  : null,
            };
          }

          return {
            ...user,
            lastMessage: {
              ...newLastMessage,
            },
          };
        })
      : null;

    dispatch(setUsersListsState(newUsersList));
  };

export const addLastMessageData =
  (userId: string, conversationId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { getUsers } = getState();
    const currentUsersList = getUsers.usersList;

    // Replace lastMessage to new for users with passed conversationId
    const newUsersList = currentUsersList
      ? currentUsersList.map((user) => {
          if (user._id !== userId) return user;
          return {
            ...user,
            lastMessage: {
              ...user.lastMessage,
              conversationId,
            } as TLastMessage,
          };
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
