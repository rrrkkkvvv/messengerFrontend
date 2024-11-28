import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import {
  logout,
  selectCurrentUser,
  selectJWTToken,
  TUserInfo,
  User,
} from "../../entities/user";
import { useGetUsersQuery } from "../../entities/user/api/usersApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { routes } from "../../shared/values/strValues";

const UsersList = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentJWT = useAppSelector(selectJWTToken);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [users, setUsers] = useState<TUserInfo[]>([]);
  const { data } = useGetUsersQuery(
    currentUser ? currentUser.email : skipToken
  );
  useEffect(() => {
    if (data) {
      if (data.message === "Unauthorized") {
        logout(navigate, dispatch);
        navigate(routes.auth);
      } else {
        setUsers(data.records);
      }
    }
  }, [data]);

  const openConversationWithUser = async (userId: number) => {
    if (currentJWT && currentUser) {
      navigate(`${routes.conversation}/${userId}`);
    }
  };
  return (
    <div className=" w-full md:w-2/5 overflow-y-auto  h-dvh bg-gray-300">
      <h1 className="h-20 flex px-20 justify-between  text-center border border-gray-200 text-white items-center">
        <span className="text-xl">Start conversation with...</span>
        <button
          className="
                  text-green-400
                  ml-2
                  px-4
                  outline-none
                  outline-green-100
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
        {users.map((user) => (
          <User
            user={user}
            onClick={() => openConversationWithUser(user.id)}
            key={user.id}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersList;
