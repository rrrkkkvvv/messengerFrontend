import { Socket } from "socket.io-client";

export type TUseSocket = (url: string) => Socket;
export type TApiSocket = Socket | null;
