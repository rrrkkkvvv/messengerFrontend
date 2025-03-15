import { TUserData, TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TSignInUserData = Omit<TUserData, "name">;

export type TEditProfileResponse =
  | {
      message: "User was edited";
      user: TUserInfo;
    }
  | {
      message: "Editing went wrong";
    };
export type TDeleteUserResponse =
  | {
      message: "User was deleted";
    }
  | {
      message: "Deleting went wrong";
    };
export type TUpdateUserResponse =
  | {
      message: "User was updated";
    }
  | {
      message: "Updating went wrong";
    };
export type TOpenGetUsersConnectionResponse =
  | {
      message: "Success get users";
      users: TUserInfo[];
      usersOnline: string[] | null;
    }
  | {
      message: "users_online_list";
      usersOnline: string[] | null;
    }
  | {
      message: "Unauthorized";
    };
