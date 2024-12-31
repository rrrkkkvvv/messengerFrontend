import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../app/store/store";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";

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
