import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";
import { logout, selectCurrentUser } from "../../entities/user";
import { useEffect, useState } from "react";
import { routes } from "../../shared/values/strValues";

import UsersList from "../../widgets/UsersList/UsersList";
import { useDispatch } from "react-redux";
import Conversation from "../../entities/conversation";
import Profile from "../../widgets/Profile";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const data = useAppSelector(selectCurrentUser);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => setIsMobile(window.innerWidth < 768);
  useEffect(() => {
    if (!data) {
      logout(navigate, dispatch);
      navigate(routes.auth);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isProfilePage = location.pathname === routes.profile;

  return (
    <div className="flex  ">
      {isMobile ? (
        <Outlet />
      ) : (
        <>
          {isProfilePage ? <Profile /> : <UsersList />}

          <Conversation />
        </>
      )}
    </div>
  );
};

export default MainPage;
