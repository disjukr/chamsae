import { useEffect } from "preact/hooks";

export default function useSocket(
  url: string,
  onOpen: (socket: WebSocket) => void,
  onClose: () => void,
) {
  useEffect(() => {
    let s: WebSocket | undefined;
    let loop = true;
    (async () => {
      while (loop) {
        const { socket, opened, closed } = connect(url);
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
