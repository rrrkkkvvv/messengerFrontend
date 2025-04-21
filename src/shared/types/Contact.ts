import { TLastMessage, TUserInfo } from "./UserEntityTypes";

export type TUserPreview = TUserInfo & {
  type: "single";
};
type TGroupConversationPreview = {
  type: "group";
  isGroup: boolean;
  avatarURL: string | null;
  _id: string;
  userIds: string[];
  name: string;
  creatorId: string;
  usersTypingIds: string[] | null;
  lastMessage: TLastMessage | null;
};
export type TGroupConversation = Omit<TGroupConversationPreview, "type">;
export type TContact = TUserPreview | TGroupConversationPreview;
export type TContactsList = TContact[];
