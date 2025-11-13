import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { selectCurrentUser } from "../../../entities/user";
import { useConnectToGetUsersChanelQuery } from "../../../entities/contact/";
import { setContactsList, setUsersOnline } from "../../../entities/contact/";
import { skipToken } from "@reduxjs/toolkit/query";
import Sidebar from "./Sidebar";
import MobileLayout from "./MobileLayout";
import { Call } from "../../../widgets/call/";
import { Conversation } from "../../../widgets/conversation";

const MainPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const {
    data = {
      contactsData: null,
      usersOnline: null,
    },
  } = useConnectToGetUsersChanelQuery(
    currentUser?.email ? { userEmail: currentUser?.email } : skipToken
  );

  useEffect(() => {
    if (data.contactsData) {
      dispatch(setContactsList(data.contactsData));
    }
    if (data.usersOnline) {
      dispatch(setUsersOnline(data.usersOnline));
    }
  }, [data]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-gray-400 h-screen  flex flex-col ">
      <div className="flex flex-1">
        {isMobile ? (
          <>
            <MobileLayout />
          </>
        ) : (
          <>
            <Sidebar />

            <Conversation />
          </>
        )}
      </div>

      <Call />
    </div>
  );
};

export default MainPage;
