import { NavigateFunction } from "react-router-dom";
import { localStorageItems, routes } from "../../../shared/values/strValues";
import { AppDispatch } from "../../../app/store/store";
import { setCurrentUser, setJWTToken } from "../model/userSlice";

const logout = (navigate: NavigateFunction, dispatch: AppDispatch) => {
  localStorage.removeItem(localStorageItems.jwtToken);
  localStorage.removeItem(localStorageItems.currentUser);
  navigate(routes.auth);
  dispatch(setCurrentUser(null));
  dispatch(setJWTToken(null));
};

export default logout;
