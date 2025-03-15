import { TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TAuthResponse = {
  data: {
    token: string;
    user: TUserInfo;
  };
};
