import { customWebsocket } from "../../../shared/types/websocketType";

export const conversationWs: customWebsocket = (() => {
  let currentWs: WebSocket | null = null;

  return {
    setWs: (ws: WebSocket | null) => {
      if (currentWs) {
        currentWs.close();
      }
      currentWs = ws;
    },

    closeWs: () => {
      if (currentWs) {
        currentWs.close();
        currentWs = null;
      }
    },

    send: (data: string | ArrayBuffer | Blob | ArrayBufferView) => {
      if (currentWs) {
        currentWs.send(data);
      } else {
        console.error("WebSocket is not initialized");
      }
    },

    get onmessage() {
      return currentWs?.onmessage || null;
    },
    set onmessage(handler) {
      if (currentWs) {
        currentWs.onmessage = handler;
      }
    },

    get onerror() {
      return currentWs?.onerror || null;
    },
    set onerror(handler) {
      if (currentWs) {
        currentWs.onerror = handler;
      }
    },

    get onopen() {
      return currentWs?.onopen || null;
    },
    set onopen(handler) {
      if (currentWs) {
        currentWs.onopen = handler;
      }
    },

    get onclose() {
      return currentWs?.onclose || null;
    },
    set onclose(handler) {
      if (currentWs) {
        currentWs.onclose = handler;
      }
    },
  };
})();
