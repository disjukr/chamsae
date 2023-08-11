import { effect, signal } from "@preact/signals";
import { ServerMessage } from "../../shared/message/server.ts";
import { Model } from "../../shared/model.ts";

export type Handler = (message: Model<typeof ServerMessage>) => void;
export type Off = () => void;

export function on(handler: Handler): Off {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

const handlers = new Set<Handler>();

export const socketSignal = signal<WebSocket | undefined>(undefined);

effect(() => {
  const socket = socketSignal.value;
  if (!socket) return;
  const handleEvent = (e: MessageEvent) => {
    const data = JSON.parse(e.data) as Model<typeof ServerMessage>;
    Object.freeze(data);
    for (const handler of handlers) handler(data);
  };
  socket.addEventListener("message", handleEvent);
  return () => socket.removeEventListener("message", handleEvent);
});
