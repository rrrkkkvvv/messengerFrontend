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
