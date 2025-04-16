import { TMessageInfo } from "../../entities/conversation/api/conversationTypes";

export type TUserInfo = {
  _id: string;
  name: string;
  email: string;
  avatarURL: string | null;
  lastMessage: TLastMessage | null;
  conversationId: string | null;
  isTyping: boolean;
};

export type TLastMessage = {
  seenStatus: boolean;
  sender?: TUserInfo;
} & Omit<TMessageInfo, "editedAt">;

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
