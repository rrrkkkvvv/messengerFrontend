import { NavigateFunction } from "react-router-dom";
import { useRefreshUserAuthMutation } from "../../auth/api/authApi";
import { AppDispatch } from "../../../app/store/store";
import { logout, setCurrentUser } from "../../../entities/user";
import { backendMessages, routes } from "../../../shared/values/strValues";
import { setIsLoggedIn } from "../../../entities/user/model/userSlice";

export const refreshAuth = async (
  refreshUserAuth: ReturnType<typeof useRefreshUserAuthMutation>[0],
  navigate: NavigateFunction,
  dispatch: AppDispatch
) => {
  try {
    const result = await refreshUserAuth().unwrap();

    if (result.message === backendMessages.auth.success.successSignin) {
      dispatch(setCurrentUser(result.user));
      dispatch(setIsLoggedIn(true));
      navigate(routes.main);
    } else {
      logout(navigate, dispatch);
      console.error(result);
    }
  } catch (error) {
    logout(navigate, dispatch);
    console.error(error);
  }
};
