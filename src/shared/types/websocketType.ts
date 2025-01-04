export type customWebsocket = {
  setWs: (ws: WebSocket | null) => void;
  closeWs: () => void;
  send: (data: string | ArrayBuffer | Blob | ArrayBufferView) => void;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  onerror: ((this: WebSocket, ev: Event) => any) | null;
  onopen: ((this: WebSocket, ev: Event) => any) | null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
};
