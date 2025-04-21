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
  sender: TUserInfo;
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
export type TEditGroupInfo = {
  _id: string;
  creatorId: string;
  name?: string;
  avatarURL?: string | null;
};
export type TUpdateGroupResponse =
  | {
      message: "Group was updated";
    }
  | {
      message: "Updating went wrong";
    };
