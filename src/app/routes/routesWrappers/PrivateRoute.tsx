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

const PrivateRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [refreshUserAuth] = useRefreshUserAuthMutation();
  useEffect(() => {
    const jwtToken = getTokenFromLS();
    if (jwtToken && jwtToken !== "null") {
      refreshAuth({
        refreshUserAuth: refreshUserAuth,
        navigate: navigate,
        dispatch: dispatch,
        isRestrictedRoute: false,
      });
    } else {
      logout(navigate, dispatch);
    }
    if (!isLoggedIn) {
      logout(navigate, dispatch);
      navigate(routes.auth);
    }
  }, [isLoggedIn, dispatch]);

  return children;
};

export default PrivateRoute;
