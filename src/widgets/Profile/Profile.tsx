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
import Avatar from "../../shared/ui/Avatar/Avatar";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentJWT = useAppSelector(selectJWTToken);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className=" w-full md:w-2/5 overflow-y-auto  h-dvh bg-gray-300">
      <h1 className="h-20 flex px-20 justify-between  text-center border border-gray-200 text-white items-center">
        <div className="flex items-center gap-5">
          <Avatar user={currentUser} />
          <span className="text-xl">{currentUser?.name}</span>
        </div>
      </h1>
      {/* Users list */}
    </div>
  );
};

export default Profile;
