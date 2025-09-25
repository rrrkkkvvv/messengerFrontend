import { TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TCallStatus =
  | "idle"
  | "accepted"
  | "outgoing"
  | "incoming"
  | "active"
  | "ended";
export type TEndCallReason = "self" | "interlocuter" | null;
export type TMediaState = {
  muted: boolean;
  videoEnable: boolean;
  screenDemoEnable: boolean;
};
export type TCallParticipant = TUserInfo & TMediaState;
