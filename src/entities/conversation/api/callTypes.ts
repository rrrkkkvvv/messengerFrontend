export type TCallStatus =
  | "idle"
  | "accepted"
  | "outgoing"
  | "incoming"
  | "active"
  | "ended";
export type TEndCallReason = "self" | "interlocute" | null;
