import { TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TCreateConversationProps = {
  member_ids: number[];
  jwtToken: string;
};

export type TMessageInfo = {
  _id: string;
  messageText?: string;
  messageImage?: string;
  seenIds: string[];
  conversationId: string;
  senderId: string;
  editedAt?: string | null;
  sentAt: string;
};
export type TConversationData = {
  _id: string;
  userIds: string[];
  isGroup: boolean;
  name?: string;
  messages: TMessageInfo[];
  members: TUserInfo[];
};
