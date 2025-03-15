import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { routes } from "../../../shared/values/strValues";

import { UsersList } from "../../../entities/user/";
import Conversation from "../../../entities/conversation/";
import Profile from "../../../widgets/Profile";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { useConnectToGetUsersChanelQuery } from "../../../entities/user/api/";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  selectCurrentUser,
  setUsersList,
  setUsersOnlineEmails,
} from "../../../entities/user/model/";

const MainPage = () => {
  const location = useLocation();
  const currentUser = useAppSelector(selectCurrentUser);
  const isProfilePage = location.pathname === routes.profile;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  const dispatch = useAppDispatch();

  // WS get users connection
  const {
    data = {
      users: null,
      usersOnline: null,
    },
  } = useConnectToGetUsersChanelQuery(
    currentUser?.email ? { userEmail: currentUser?.email } : skipToken
  );

  useEffect(() => {
    if (data.users) {
      dispatch(setUsersList(data.users));
    }
    if (data.usersOnline) {
      dispatch(setUsersOnlineEmails(data.usersOnline));
    }
  }, [data]);
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
          {isProfilePage ? <Profile /> : <UsersList />}

          <Conversation />
        </>
      )}
    </div>
  );
};

export default MainPage;
