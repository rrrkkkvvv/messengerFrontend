import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { routes } from "../../../shared/values/strValues";
import { refreshAuth } from "../utils/refreshAuth";
import getTokenFromLS from "../../../shared/utils/getTokenFromLS";
import {
  logout,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../../entities/user";

type TPrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: TPrivateRouteProps) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const jwtToken = getTokenFromLS();
    if (jwtToken && !currentUser) {
      refreshAuth({
        navigate: navigate,
        dispatch: dispatch,
        isRestrictedRoute: false,
      });
    }
    if (!isLoggedIn) {
      logout(navigate, dispatch);
      navigate(routes.auth);
    }
  }, [isLoggedIn, dispatch]);

  return children;
};

export default PrivateRoute;
