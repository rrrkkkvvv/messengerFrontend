import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { routes } from "../../../shared/values/strValues";

import Conversation from "../../../entities/conversation/";
import Profile from "../../../widgets/Profile";
import { ContactsList } from "../../../entities/contact";

const MainPage = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === routes.profile;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex  ">
      {isMobile ? (
        <Outlet />
      ) : (
        <>
          {isProfilePage ? <Profile /> : <ContactsList />}

          <Conversation />
        </>
      )}
    </div>
  );
};

export default MainPage;
