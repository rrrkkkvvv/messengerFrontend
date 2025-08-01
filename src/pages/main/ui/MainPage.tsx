import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Conversation from "../../../entities/conversation/";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useAppDispatch } from "../../../app/store/store";
import { routes } from "../../../shared/values/strValues";
import ProfileModal from "../../../widgets/Profile";
import { logout } from "../../../entities/user";
import { ContactsList } from "../../../entities/contact";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isMainPage = location.pathname === routes.main;

  const [isOpenModal, setIsOpenModal] = useState(false);
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
    <div className="flex  ">
      {isMobile ? (
        isMainPage ? (
          <>
            <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden  bg-gray-300">
              <h1 className="h-20 flex  justify-around  text-center border border-gray-200 text-white items-center">
                <button
                  className="
                  text-green-400
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-green-400
                  hover:outline-green-200"
                  onClick={handleOpenModal}
                >
                  <CgProfile className="text-2xl" />
                  My profile
                </button>
                <button
                  className="
            text-green-400
            flex
            gap-3
            items-center
            ml-2
            px-4
            outline-none
            rounded-sm
            transition-all
            focus:outline-green-400
            hover:outline-green-200
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
            {/* <Modal alwaysRender={true} onClose={handleCloseModal} isOpen={isOpenModal}>
              <Profile closeProfile={handleCloseModal} />
            </Modal> */}
          </>
        ) : (
          <Outlet />
        )
      ) : (
        <>
          <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden  bg-gray-300">
            <h1 className="h-20 flex  justify-around  text-center border border-gray-200 text-white items-center">
              <button
                className="
                  text-green-400
                  flex
                  gap-3
                  items-center
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-green-400
                  hover:outline-green-200"
                onClick={handleOpenModal}
              >
                <CgProfile className="text-2xl" />
                My profile
              </button>
              <button
                className="
            text-green-400
            flex
            gap-3
            items-center
            ml-2
            px-4
            outline-none
            rounded-sm
            transition-all
            focus:outline-green-400
            hover:outline-green-200
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

          {/* <Modal onClose={handleCloseModal} isOpen={isOpenModal}>
            <Profile closeProfile={handleCloseModal} />
          </Modal> */}
        </>
      )}
    </div>
  );
};

export default MainPage;
