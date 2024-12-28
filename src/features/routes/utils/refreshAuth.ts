import { NavigateFunction } from "react-router-dom";
import { useRefreshUserAuthMutation } from "../../auth/api/authApi";
import { AppDispatch } from "../../../app/store/store";
import { logout, setCurrentUser } from "../../../entities/user";
import { backendMessages, routes } from "../../../shared/values/strValues";
import { setIsLoggedIn } from "../../../entities/user/model/userSlice";
type TRefreshAuthProps = {
  refreshUserAuth: ReturnType<typeof useRefreshUserAuthMutation>[0];
  navigate: NavigateFunction;
  dispatch: AppDispatch;
  isRestrictedRoute?: boolean;
};
export const refreshAuth = async ({
  dispatch,
  navigate,
  refreshUserAuth,
  isRestrictedRoute,
}: TRefreshAuthProps) => {
  try {
    const result = await refreshUserAuth().unwrap();

    if (result.message === backendMessages.auth.success.successSignin) {
      dispatch(setCurrentUser(result.user));
      dispatch(setIsLoggedIn(true));
      if (isRestrictedRoute) {
        navigate(routes.main);
      }
    } else {
      logout(navigate, dispatch);
      console.error(result);
    }
  } catch (error) {
    logout(navigate, dispatch);
    console.error(error);
  }
};
