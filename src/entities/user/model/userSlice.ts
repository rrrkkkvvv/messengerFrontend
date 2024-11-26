import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../app/store/store";
import getTokenFromLS from "../utils/getTokenFromLC";
import getCurrentUserFromLS from "../utils/getCurrentUserFromLC";
import { TUserInfo } from "../api/userTypes";
import { localStorageItems } from "../../../shared/values/strValues";

interface ICurrentUserSliceProps {
  currentUser: TUserInfo | null;
  jwtToken: string | null;
}

const initialState: ICurrentUserSliceProps = {
  currentUser: getCurrentUserFromLS(),
  jwtToken: getTokenFromLS(),
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUserState: (state, action: PayloadAction<TUserInfo | null>) => {
      state.currentUser = action.payload;
    },
    setJWTTokenState: (state, action: PayloadAction<string | null>) => {
      state.jwtToken = action.payload;
    },
  },
  selectors: {
    selectCurrentUser: (state) => state.currentUser,
    selectCurrentUserPicture: (state) => state.currentUser?.picture,
    selectJWTToken: (state) => state.jwtToken,
  },
});

const { setJWTTokenState, setCurrentUserState } = currentUserSlice.actions;

export const setCurrentUser =
  (user: TUserInfo | null) => async (dispatch: AppDispatch) => {
    localStorage.setItem(localStorageItems.currentUser, JSON.stringify(user));
    dispatch(setCurrentUserState(user));
  };

export const setJWTToken =
  (token: string | null) => async (dispatch: AppDispatch) => {
    localStorage.setItem(
      localStorageItems.jwtToken,
      token ? token : JSON.stringify(token)
    );
    dispatch(setJWTTokenState(token));
  };

export const { selectCurrentUser, selectCurrentUserPicture, selectJWTToken } =
  currentUserSlice.selectors;
const currentUserReducer = currentUserSlice.reducer;
export default currentUserReducer;
