export type TUserData = {
  name: string;
  email: string;
  password: string;
};
export type TUserInfo = {
  id: number;
  name: string;
  email: string;
  picture: string | null;
};

export type TGetUsersResponse =
  | {
      message: "success";
      records: TUserInfo[];
    }
  | {
      message: "Unauthorized";
    };
export type TSignInUserData = Omit<TUserData, "name">;
export type TProfile = {
  id: number;
  picture?: null | string;
  name?: string;
};
export type TEditProfileResponse =
  | {
      message: "User was edited";
      user: TUserInfo;
    }
  | {
      message: "Editing went wrong";
    };

export type TOpenGetUsersConnectionResponse =
  | {
      message: "Success get users";
      users: TUserInfo[];
      usersOnline: string | null[];
    }
  | {
      message: "Unauthorized";
    };
