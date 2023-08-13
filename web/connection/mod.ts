import { effect, signal } from "@preact/signals";
import type { ClientMessage } from "../../shared/message/client.ts";
import type { ServerMessage } from "../../shared/message/server.ts";
import type { Model } from "../../shared/model.ts";

export type Handler = (message: Model<typeof ServerMessage>) => void;
export type Off = () => void;

export function on(handler: Handler): Off {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function send(message: Model<typeof ClientMessage>): void {
  socketSignal.value?.send(JSON.stringify(message));
}

export const socketSignal = signal<WebSocket | undefined>(undefined);

const handlers = new Set<Handler>();
const handleEvent = (e: MessageEvent) => {
  const data = JSON.parse(e.data) as Model<typeof ServerMessage>;
  Object.freeze(data);
  for (const handler of handlers) handler(data);
};

effect(() => {
  const socket = socketSignal.value;
  if (!socket) return;
  socket.addEventListener("message", handleEvent);
  return () => socket.removeEventListener("message", handleEvent);
});
