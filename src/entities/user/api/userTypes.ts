import { TUserData, TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TAuthResponse = {
  data: {
    token: string;
    user: TUserInfo;
  };
};
export type TSignInUserData = Omit<TUserData, "name">;

export type TEditProfileResponse = {
  data: Pick<TUserInfo, "_id" | "name" | "avatarURL">;
};
export type TEditedProfile = {
  name?: string;
  avatar?: {
    fileBuffer: number[] | null;
  };
};
