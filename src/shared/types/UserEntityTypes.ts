import { TMessageInfo } from "../../entities/conversation/api/conversationTypes";

export type TUserInfo = {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  // lastMessage: TMessageInfo | null;
};
