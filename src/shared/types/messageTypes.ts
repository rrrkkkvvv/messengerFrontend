import { TUserInfo } from "./UserEntityTypes";

export type TMessageInfo =
  | {
      isCallInfo: false;

      _id: string;

      isAudioMessage: boolean;

      messageText?: string;
      messageImage?: string;
      audioMessage?: string;

      seenIds: string[];
      conversationId: string;
      senderId: string;
      sender: TUserInfo | undefined;
      editedAt?: string | null;
      pendingId?: string;
      pending?: boolean;
      sentAt: string;
    }
  | {
      isCallInfo: true;
      _id: string;
      conversationId: string;
      duration: number;
      isAnswered: boolean;
      isEnded: boolean;
      sentAt: string;
      senderId: string;
      sender: TUserInfo | undefined;
    };
