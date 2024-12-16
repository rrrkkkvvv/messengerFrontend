import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { selectIsLoggedIn } from "../../entities/user/model/userSlice";
import { localStorageItems, routes } from "../../shared/values/strValues";
import { useRefreshUserAuthMutation } from "../auth/api/authApi";
import { logout } from "../../entities/user";
import { refreshAuth } from "./utils/refreshAuth";

type TPrivateRouteProps = {
  children: ReactNode;
};

const RestrictedRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [refreshUserAuth] = useRefreshUserAuthMutation();

  useEffect(() => {
    const jwtToken = localStorage.getItem(localStorageItems.jwtToken);
    if (jwtToken && jwtToken !== "null") {
      refreshAuth(refreshUserAuth, navigate, dispatch);
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
