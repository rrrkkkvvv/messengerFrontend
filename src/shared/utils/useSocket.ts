import { io } from "socket.io-client";
import { TUseSocket } from "../types/websocketType";
import getTokenFromLS from "./getTokenFromLS";

export const useSocket: TUseSocket = (url: string) => {
  const socket = io(url, {
    auth: {
      token: getTokenFromLS(),
    },
    transports: ["websocket"],
  });

  return socket;
};
