import { useAppDispatch, useAppSelector } from "../../../app/store/store";
import { logout, User } from "..";
import { CiCirclePlus, CiLogout } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import { routes } from "../../../shared/values/strValues";
import { CgProfile } from "react-icons/cg";
import { selectUsersList, selectUsersOnlineEmails } from "../model/";
import { selectCurrentUser } from "../model/";

const UsersList = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const usersList = useAppSelector(selectUsersList);
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const openConversationWithUser = async (userId: string) => {
    navigate(`${routes.conversationBase}/${userId}`);
  };
  const createGroupConversation = async () => {};
  return (
    <div className=" w-full md:w-2/5 relative  h-dvh overflow-hidden bg-gray-300">
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
          onClick={() => navigate("/profile")}
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
          hover:outline-green-200"
          onClick={() => logout(navigate, dispatch)}
        >
          <CiLogout className="text-2xl" />
          Logout
        </button>
      </h1>
      {/* Users list */}
      <div className="relative  max-h-full overflow-y-auto   text-green-200">
        {usersList &&
          [...usersList]
            .sort((a, b) => {
              const timeA = a.lastMessage?.sentAt
                ? new Date(a.lastMessage.sentAt).getTime()
                : 0;
              const timeB = b.lastMessage?.sentAt
                ? new Date(b.lastMessage.sentAt).getTime()
                : 0;

              return timeB - timeA;
            })
            .map((user) => {
              let isOnline = usersOnlineEmails?.includes(user.email);

              return (
                <User
                  isOnline={!!isOnline}
                  user={user}
                  currentUserId={currentUser?._id || null}
                  onClick={() => openConversationWithUser(user._id)}
                  key={user._id}
                />
              );
            })}
      </div>

      <CiCirclePlus
        onClick={createGroupConversation}
        className="right-4 absolute bottom-10 bg-green-900 text-green-200 hover:bg-green-800 hover:text-green-100 rounded-full box-border  text-6xl cursor-pointer  z-50"
      />
    </div>
  );
};

export default UsersList;
