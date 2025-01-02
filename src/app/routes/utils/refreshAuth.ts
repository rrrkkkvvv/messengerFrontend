import { NavigateFunction } from "react-router-dom";
import { useRefreshUserAuthMutation } from "../../../pages/auth/";
import { AppDispatch } from "../../store/store";
import { logout } from "../../../entities/user";
import { backendMessages, routes } from "../../../shared/values/strValues";
import { setCurrentUser, setIsLoggedIn } from "../../../entities/user/model/";
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
