import { TUserInfo } from "../../../entities/user";

export type TDefaultResponse = {
  message: string;
};

export type TGoogleApiResponse =
  | Omit<TUserInfo, "id">
  | TGoogleApiErrorResponse;

export type TGoogleApiErrorResponse = {
  error: string;
  error_description: string;
};

export type TAuthResponse = {
  id: string | number;
  success: boolean;
  message: string;
  token: string;
  user: TUserInfo;
};