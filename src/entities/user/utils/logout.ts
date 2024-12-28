import { NavigateFunction } from "react-router-dom";
import { localStorageItems, routes } from "../../../shared/values/strValues";
import { AppDispatch } from "../../../app/store/store";
import { setCurrentUser, setIsLoggedIn, setJWTToken } from "../model/userSlice";
import { usersWs } from "./usersWs";
import {
  setUsersList,
  setUsersOnlineEmails,
} from "../../../widgets/UsersList/model/getUsersSlice";
import baseApi from "../../../app/api/baseApi";

const logout = (navigate: NavigateFunction, dispatch: AppDispatch) => {
  usersWs.closeWs();
  dispatch(baseApi.util.resetApiState());
  dispatch(setUsersList(null));
  dispatch(setUsersOnlineEmails(null));
  localStorage.removeItem(localStorageItems.jwtToken);
  localStorage.removeItem(localStorageItems.isLoggedIn);
  navigate(routes.auth);
  dispatch(setCurrentUser(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setJWTToken(null));
};

export default logout;
