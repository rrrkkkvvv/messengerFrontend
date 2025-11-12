import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { logout } from "../../../entities/user";
import { routes } from "../../../shared/values/strValues";
import userApi from "../../../entities/user/api/userApi";
import { setUserLoginData } from "../../../entities/user/model/userSlice";
type TRefreshAuthProps = {
  navigate: NavigateFunction;
  dispatch: AppDispatch;
  isRestrictedRoute?: boolean;
};
export const refreshAuth = async ({
  dispatch,
  navigate,
  isRestrictedRoute,
}: TRefreshAuthProps) => {
  try {
    const result = await dispatch(userApi.endpoints.refreshUserAuth.initiate());
    if (!result.error) {
      dispatch(
        setUserLoginData({
          loginStatus: true,
          user: result.data.data.user,
        })
      );

      if (isRestrictedRoute) {
        navigate(routes.main);
      }
    } else {
      throw new Error("Cannot refresh authentication");
    }
  } catch (error) {
    logout(navigate, dispatch);
    console.error(error);
  }
};
