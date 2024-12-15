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
import { logout } from "../../../entities/user";
import { useRefreshUserAuthMutation } from "../../../features/auth/api/authApi";

type TPrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [refreshUserAuth] = useRefreshUserAuthMutation();
  useEffect(() => {
    const jwtToken = localStorage.getItem(localStorageItems.jwtToken);
    if (jwtToken && jwtToken !== "null") {
      console.log(jwtToken);
      refreshAuth();
    } else {
      logout(navigate, dispatch);
    }
    if (!isLoggedIn) {
      logout(navigate, dispatch);
      navigate(routes.auth);
    }
  }, [isLoggedIn, dispatch]);
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

  return children;
};

export default PrivateRoute;
