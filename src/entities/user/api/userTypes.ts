import { TUserData, TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TAuthResponse = {
  data: {
    token: string;
    user: TUserInfo;
  };
};
export type TSignInUserData = Omit<TUserData, "name">;
