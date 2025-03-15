import { NavigateFunction } from "react-router-dom";
import { localStorageItems, routes } from "../../../shared/values/strValues";
import { AppDispatch } from "../../../app/store/store";
import { setCurrentUser, setIsLoggedIn, setJWTToken } from "../model/";
import { setUsersList, setUsersOnlineEmails } from "../model/";
import baseApi from "../../../app/api/baseApi";
import authApi from "../../../pages/auth/api/authApi";
import usersApi from "../api/usersApi";

const logout = (navigate: NavigateFunction, dispatch: AppDispatch) => {
  dispatch(setUsersList(null));
  dispatch(setUsersOnlineEmails(null));
  dispatch(setCurrentUser(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setJWTToken(null));

  dispatch(authApi.endpoints.logout.initiate());
  dispatch(usersApi.endpoints.disconnectFromSocket.initiate());
  dispatch(baseApi.util.resetApiState());

  localStorage.removeItem(localStorageItems.jwtToken);
  localStorage.removeItem(localStorageItems.isLoggedIn);

  navigate(routes.auth);
};

export default logout;
