import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { routes } from "../../shared/values/strValues";

import UsersList from "../../widgets/UsersList/UsersList";
import Conversation from "../../entities/conversation";
import Profile from "../../widgets/Profile";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import {
  useConnectToGetUsersChanelQuery,
  useInvalidateGetUsersMutation,
} from "../../entities/user/api/usersApi";
import { selectCurrentUser } from "../../entities/user";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  setUsersList,
  setUsersOnlineEmails,
} from "../../widgets/UsersList/model/getUsersSlice";

const MainPage = () => {
  const location = useLocation();
  const currentUser = useAppSelector(selectCurrentUser);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  const dispatch = useAppDispatch();

  // Chat connection
  const {
    data = {
      users: null,
      usersOnline: null,
    },
  } = useConnectToGetUsersChanelQuery(
    currentUser?.email ? { userEmail: currentUser?.email } : skipToken
  );
  const [invalidateGetUsers] = useInvalidateGetUsersMutation();
  const handleInvalidateGetUsers = async () => {
    try {
      await invalidateGetUsers().unwrap();
    } catch (error) {
      console.error("Failed to invalidate get users:", error);
    }
  };

  useEffect(() => {
    if (data.users && data.usersOnline) {
      dispatch(setUsersList(data.users));
      dispatch(setUsersOnlineEmails(data.usersOnline));
    }
    if (data.usersOnline) {
      dispatch(setUsersOnlineEmails(data.usersOnline));
    }
    if (data.users === null || data.usersOnline === null) {
      handleInvalidateGetUsers();
    }
  }, [data]);
  useEffect(() => {
    handleInvalidateGetUsers();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
