export type TUserData = {
  name: string;
  email: string;
  password: string;
};
export type TUserInfo = {
  id: number;
  name: string;
  email: string;
  picture: string;
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
  picture: null | string;
  name: null | string;
};
export type TEditProfileResponse =
  | {
      message: "User was edited";
      user: TUserInfo;
    }
  | {
      message: "Editing went wrong";
    };
