import { TMessageInfo } from "../../entities/conversation/api/conversationTypes";

export type TUserInfo = {
  _id: string;
  name: string;
  email: string;
  avatarURL: string | null;
  lastMessage: TLastMessage | null;
};

export type TLastMessage = Omit<TMessageInfo, "editedAt" | "seenIds">;

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
