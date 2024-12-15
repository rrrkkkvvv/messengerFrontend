import { NavigateFunction } from "react-router-dom";
import { localStorageItems, routes } from "../../../shared/values/strValues";
import { AppDispatch } from "../../../app/store/store";
import { setCurrentUser, setIsLoggedIn, setJWTToken } from "../model/userSlice";

const logout = (navigate: NavigateFunction, dispatch: AppDispatch) => {
  localStorage.removeItem(localStorageItems.jwtToken);
  localStorage.removeItem(localStorageItems.isLoggedIn);
  navigate(routes.auth);
  dispatch(setCurrentUser(null));
  dispatch(setIsLoggedIn(false));
  dispatch(setJWTToken(null));
};

export default logout;
