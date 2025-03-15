export type TUserInfo = {
  _id: string;
  name: string;
  email: string;
  avatarURL: string | null;
};
export type TUserData = {
  name: string;
  email: string;
  password: string;
};

export type TProfile = {
  _id: string;
  avatarURL?: null | string;
  name?: string;
};
