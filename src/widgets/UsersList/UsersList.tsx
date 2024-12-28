import { useAppDispatch, useAppSelector } from "../../app/store/store";
import {
  logout,
  selectCurrentUser,
  selectJWTToken,
  User,
} from "../../entities/user";

import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/values/strValues";
import { CgProfile } from "react-icons/cg";
import {
  selectUsersList,
  selectUsersOnlineEmails,
} from "./model/getUsersSlice";

const UsersList = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentJWT = useAppSelector(selectJWTToken);

  const usersList = useAppSelector(selectUsersList);
  const usersOnlineEmails = useAppSelector(selectUsersOnlineEmails);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const openConversationWithUser = async (userId: number) => {
    if (currentJWT && currentUser) {
      navigate(`${routes.conversation}/${userId}`);
    }
  };
  return (
    <div className=" w-full md:w-2/5 overflow-y-auto  h-dvh bg-gray-300">
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
                  ml-2
                  px-4
                  outline-none
                  rounded-sm
                  transition-all
                  focus:outline-green-400
                  hover:outline-green-200"
          onClick={() => logout(navigate, dispatch)}
        >
          Logout
        </button>
      </h1>
      {/* Users list */}
      <div className=" text-green-200">
        {usersList?.map((user) => {
          let isOnline = usersOnlineEmails?.includes(user.email);

          return (
            <User
              isOnline={!!isOnline}
              user={user}
              onClick={() => openConversationWithUser(user.id)}
              key={user.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UsersList;
