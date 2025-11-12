import { TMediaState } from "../../../shared/types/callTypes";
import { TUserInfo } from "../../../shared/types/UserEntityTypes";

export type TCallStatus =
  | "idle"
  | "accepted"
  | "outgoing"
  | "incoming"
  | "active"
  | "ended";
export type TEndCallReason = "self" | "interlocuter" | null;

export type TCallParticipant = TUserInfo & TMediaState;
