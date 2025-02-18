import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useRefreshUserAuthMutation } from "../../../pages/auth/";
import { routes } from "../../../shared/values/strValues";
import { refreshAuth } from "../utils/refreshAuth";
import { logout } from "../../../entities/user";
import getTokenFromLS from "../../../shared/utils/getTokenFromLS";
import { selectIsLoggedIn } from "../../../entities/user/model/";

type TPrivateRouteProps = {
  children: ReactNode;
};

const RestrictedRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [refreshUserAuth] = useRefreshUserAuthMutation();

  useEffect(() => {
    const jwtToken = getTokenFromLS();
    if (jwtToken) {
      refreshAuth({
        refreshUserAuth: refreshUserAuth,
        navigate: navigate,
        dispatch: dispatch,
        isRestrictedRoute: true,
      });
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
