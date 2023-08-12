import { useEffect } from "preact/hooks";
import useHandlers from "./useHandlers.ts";

export default function useSocket(
  host: string,
  onOpen: (socket: WebSocket) => void,
  onClose: () => void,
) {
  const url = new URL(host);
  useHandlers({
    "hello"({ connId, secret }) {
      url.searchParams.set("connId", connId);
      url.searchParams.set("secret", secret);
    },
  });
  useEffect(() => {
    let s: WebSocket | undefined;
    let loop = true;
    (async () => {
      while (loop) {
        const { socket, opened, closed } = connect(String(url));
        s = socket;
        await Promise.any([
          opened.then(() => onOpen(socket)),
          closed,
        ]);
        await closed;
        onClose();
      }
    })();
    return () => {
      loop = false;
      s?.close();
    };
  }, [url]);
}

export interface ConnectResult {
  socket: WebSocket;
  opened: Promise<void>;
  closed: Promise<void>;
}
export function connect(url: string) {
  const socket = new WebSocket(url);
  const opened = new Promise((resolve) => {
    socket.addEventListener("open", resolve);
  });
  const closed = new Promise((resolve) => {
    socket.addEventListener("close", resolve);
  });
  socket.addEventListener("error", () => socket.close());
  return { socket, opened, closed };
}
