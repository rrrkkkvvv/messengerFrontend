import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { routes } from "../../shared/values/strValues";

import UsersList from "../../widgets/UsersList/UsersList";
import Conversation from "../../entities/conversation";
import Profile from "../../widgets/Profile";

const MainPage = () => {
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => setIsMobile(window.innerWidth < 768);

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
