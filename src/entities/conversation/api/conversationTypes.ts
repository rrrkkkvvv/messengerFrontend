import { TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TCreateConversationProps = {
  member_ids: number[];
  jwtToken: string;
};

export type TMessageInfo = {
  message_id: number;
  message_text: string | null;
  message_image: string | null;
  conversation_id: number;
  sender_name: string;
  sender_id: number;
  sent_at: string;
  edited_at: string | null;
};
export type TConversation = {
  members: TUserInfo[] | null;
  messages: TMessageInfo[] | null;
};

export type TOpenConversationConnectionResponse =
  | {
      message: "Conversation is created/already exists";
      messages: TMessageInfo[] | null;
      members: TUserInfo[];
      conversationId: number;
    }
  | {
      message: "Update";
      messages: TMessageInfo[];
    }
  | {
      message: "Conversation was deleted";
    };
