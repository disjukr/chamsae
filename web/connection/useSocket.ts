import { useEffect } from "preact/hooks";
import { wait } from "shared/misc/async.ts";
import useHandlers from "./useHandlers.ts";

export default function useSocket(
  host: string,
  onOpen: (socket: WebSocket) => void,
  onClose: () => void,
  onFail: () => void,
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
    let failCount = 0;
    (async () => {
      while (loop) {
        const { socket, opened, closed } = connect(String(url));
        s = socket;
        await Promise.any([
          opened.then(() => {
            failCount = 0;
            onOpen(socket);
          }),
          closed,
        ]);
        await closed;
        onClose();
        if (++failCount > 5) {
          onFail();
          break;
        } else {
          await wait((500 + 500 * Math.random()) * failCount);
        }
      }
    })();
    return () => {
      loop = false;
      s?.close();
    };
  }, [host]);
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
