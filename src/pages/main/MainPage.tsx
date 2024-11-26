import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";
import { logout, selectCurrentUser } from "../../entities/user";
import { useEffect, useState } from "react";
import { routes } from "../../shared/values/strValues";

import Conversations from "../../widgets/UsersList/UsersList";
import { useDispatch } from "react-redux";
import Conversation from "../../entities/conversation";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useAppSelector(selectCurrentUser);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!data) {
      logout(navigate, dispatch);
      navigate(routes.auth);
    }
  }, []);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex  ">
      {isMobile ? (
        <Outlet />
      ) : (
        <>
          <Conversations />
          <Conversation />
        </>
      )}
    </div>
  );
};

export default MainPage;
