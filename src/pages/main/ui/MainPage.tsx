import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Conversation from "../../../entities/conversation/";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { routes } from "../../../shared/values/strValues";
import ProfileModal from "../../../widgets/Profile";
import { logout, selectCurrentUser } from "../../../entities/user";
import { ContactsList } from "../../../entities/contact";
import Call from "../../../entities/conversation/ui/Call/CallPortal";
import { useConnectToGetUsersChanelQuery } from "../../../entities/contact/api";
import {
  setContactsList,
  setUsersOnlineEmails,
} from "../../../entities/contact/model/contactSlice";
import { skipToken } from "@reduxjs/toolkit/query";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isMainPage = location.pathname === routes.main;
  const currentUser = useAppSelector(selectCurrentUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
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
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex justify-center  ">
      {isMobile ? (
        isMainPage ? (
          <>
            <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden  bg-purple-100">
              <h1 className="h-20 flex  justify-around  text-center border border-gray-200 text-white items-center">
                <button
                  className="
                  text-white
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-purple-200
                  hover:outline-purple-50"
                  onClick={handleOpenModal}
                >
                  <CgProfile className="text-2xl" />
                  My profile
                </button>
                <button
                  className="
            text-white
            flex
            gap-3
            items-center
            ml-2
            px-4
            outline-none
            rounded-sm
            transition-all
            focus:outline-purple-200
            hover:outline-purple-50
          "
                  onClick={() => logout(navigate, dispatch)}
                >
                  <CiLogout className="text-2xl" />
                  Logout
                </button>
              </h1>
              <ContactsList />
            </div>
            <ProfileModal onClose={handleCloseModal} isOpen={isOpenModal} />
          </>
        ) : (
          <Outlet />
        )
      ) : (
        <>
          <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden  bg-purple-100">
            <h1 className="h-20 flex  justify-around  text-center border border-gray-200 text-white items-center">
              <button
                className="
                  text-white
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-purple-200
                  hover:outline-purple-50"
                onClick={handleOpenModal}
              >
                <CgProfile className="text-2xl" />
                My profile
              </button>
              <button
                className="
            text-white
            flex
            gap-3
            items-center
            ml-2
            px-4
            outline-none
            rounded-sm
            transition-all
            focus:outline-purple-200
            hover:outline-purple-50
          "
                onClick={() => logout(navigate, dispatch)}
              >
                <CiLogout className="text-2xl" />
                Logout
              </button>
            </h1>
            <ContactsList />
          </div>
          <Conversation />
          <ProfileModal onClose={handleCloseModal} isOpen={isOpenModal} />
        </>
      )}
      {/* <TestDnD /> */}
      <Call />
    </div>
  );
};

export default MainPage;
