import { NavigateFunction } from "react-router-dom";
import { localStorageItems, routes } from "../../../shared/values/strValues";
import { AppDispatch } from "../../../app/store/store";

import baseApi from "../../../app/api/baseApi";
import { setUserLoginData } from "../model/userSlice";
import userApi from "../api/userApi";

const logout = (navigate: NavigateFunction, dispatch: AppDispatch) => {
  dispatch(userApi.endpoints.logout.initiate());
  dispatch(baseApi.util.resetApiState());
  dispatch(
    setUserLoginData({
      loginStatus: false,
    })
  );

  localStorage.removeItem(localStorageItems.jwtToken);
  localStorage.removeItem(localStorageItems.isLoggedIn);

  navigate(routes.auth);
};

export default logout;
