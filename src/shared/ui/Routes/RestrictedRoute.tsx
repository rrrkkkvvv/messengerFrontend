import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import {
  selectIsLoggedIn,
  setCurrentUser,
  setIsLoggedIn,
} from "../../../entities/user/model/userSlice";
import {
  backendMessages,
  localStorageItems,
  routes,
} from "../../values/strValues";
import { useRefreshUserAuthMutation } from "../../../features/auth/api/authApi";
import { logout } from "../../../entities/user";

type TPrivateRouteProps = {
  children: ReactNode;
};

const RestrictedRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [refreshUserAuth] = useRefreshUserAuthMutation();

  const refreshAuth = async () => {
    const result = await refreshUserAuth().unwrap();

    if (result.message === backendMessages.auth.success.successSignin) {
      dispatch(setCurrentUser(result.user));
      dispatch(setIsLoggedIn(true));

      navigate(routes.main);
    } else {
      logout(navigate, dispatch);
      console.error(result);
    }
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem(localStorageItems.jwtToken);
    if (jwtToken && jwtToken !== "null") {
      console.log(jwtToken);
      refreshAuth();
    } else {
      logout(navigate, dispatch);
    }
    if (isLoggedIn) {
      navigate(routes.main);
    }
  }, [isLoggedIn, dispatch]);

  return children;
};

export default RestrictedRoute;
