import { useEffect, useState } from "react";

import Conversation from "../../../entities/conversation/";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { selectCurrentUser } from "../../../entities/user";
import Call from "../../../entities/conversation/ui/Call/CallPortal";
import { useConnectToGetUsersChanelQuery } from "../../../entities/contact/api";
import {
  setContactsList,
  setUsersOnlineEmails,
} from "../../../entities/contact/model/contactSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import SideBar from "./SideBar";
import MobileLayout from "./MobileLayout";

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
      dispatch(setUsersOnlineEmails(data.usersOnline));
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
          <MobileLayout />
        ) : (
          <>
            {/*<SideBar />*/}

            <Conversation />
          </>
        )}
      </div>

      <Call />
    </div>
  );
};

export default MainPage;
