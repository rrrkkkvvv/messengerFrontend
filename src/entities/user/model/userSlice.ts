import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../app/store/store";
import getTokenFromLS from "../utils/getTokenFromLS";
import { TUserInfo } from "../api/userTypes";
import { localStorageItems } from "../../../shared/values/strValues";
import getIsLoggedInLS from "../utils/getIsloggedInFromLS";

interface ICurrentUserSliceProps {
  currentUser: TUserInfo | null;
  jwtToken: string | null;
  isLoggedIn: boolean;
}

const initialState: ICurrentUserSliceProps = {
  currentUser: null,
  jwtToken: getTokenFromLS(),
  isLoggedIn: getIsLoggedInLS(),
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
    setIsLoggedInState: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
  selectors: {
    selectCurrentUser: (state) => state.currentUser,
    selectCurrentUserPicture: (state) => state.currentUser?.picture,
    selectJWTToken: (state) => state.jwtToken,
    selectIsLoggedIn: (state) => state.isLoggedIn,
  },
});

const { setJWTTokenState, setCurrentUserState, setIsLoggedInState } =
  currentUserSlice.actions;

export const setCurrentUser =
  (user: TUserInfo | null) => async (dispatch: AppDispatch) => {
    dispatch(setCurrentUserState(user));
  };
export const setIsLoggedIn =
  (loginStatus: boolean) => async (dispatch: AppDispatch) => {
    if (loginStatus) {
      localStorage.setItem(
        localStorageItems.isLoggedIn,
        localStorageItems.isLoggedInText
      );
    } else {
      localStorage.setItem(localStorageItems.isLoggedIn, "");
    }
    dispatch(setIsLoggedInState(loginStatus));
  };
export const setJWTToken =
  (token: string | null) => async (dispatch: AppDispatch) => {
    localStorage.setItem(
      localStorageItems.jwtToken,
      token ? token : JSON.stringify(token)
    );
    dispatch(setJWTTokenState(token));
  };

export const {
  selectCurrentUser,
  selectCurrentUserPicture,
  selectJWTToken,
  selectIsLoggedIn,
} = currentUserSlice.selectors;
const currentUserReducer = currentUserSlice.reducer;
export default currentUserReducer;
