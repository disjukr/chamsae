import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { ServerMessage } from "../../shared/message/server.ts";
import { disconnect, revive } from "./keep.ts";
import { Model } from "../../shared/model.ts";

export interface ReconnectionInfo {
  connId: string;
  secret: string;
}
export interface ConnectConfig {
  socket: WebSocket;
  reconnect?: ReconnectionInfo;
}
export interface ConnectResult {
  connId: string;
  secret: string;
}
export function connect({
  socket,
  reconnect,
}: ConnectConfig): Promise<ConnectResult> {
  if (reconnect) {
    const { connId, secret } = reconnect;
    if (id2socket.has(connId)) return Promise.reject(new ReconnectionError());
    const revived = revive(connId, secret);
    if (revived) {
      const { store } = revived;
      return _connect(socket, connId, secret, store);
    }
  }
  return _connect(socket);
}

export class ReconnectionError extends Error {}

export type Store = Record<string, any>;

export function send(socket: WebSocket, message: Model<typeof ServerMessage>) {
  socket.send(JSON.stringify(message));
}

export function getConnId(socket: WebSocket): string | undefined {
  return socket2id.get(socket);
}

export function getSocket(connId: string): WebSocket | undefined {
  return id2socket.get(connId);
}

export function getStore(
  connIdOrSocket: string | WebSocket,
): Store | undefined {
  const socket = typeof connIdOrSocket === "string"
    ? getSocket(connIdOrSocket)
    : connIdOrSocket;
  return socket && socket2store.get(socket);
}

const id2socket = new Map<string, WebSocket>();
const socket2id = new WeakMap<WebSocket, string>();
const socket2store = new WeakMap<WebSocket, Store>();

function _connect(
  socket: WebSocket,
  _connId?: string,
  secret: string = nanoid(),
  store: Store = {},
): Promise<ConnectResult> {
  return new Promise((resolve) => {
    socket.addEventListener("open", () => {
      const connId = _connId || newConnId();
      id2socket.set(connId, socket);
      socket2id.set(socket, connId);
      socket2store.set(socket, store);
      resolve({ connId, secret });
    });
    socket.addEventListener("close", () => {
      const connId = socket2id.get(socket)!;
      id2socket.delete(connId);
      socket2id.delete(socket);
      socket2store.delete(socket);
      disconnect(connId, secret, store);
    });
  });
}

function newConnId(): string {
  while (true) {
    const connId = nanoid();
    if (id2socket.has(connId)) continue;
    return connId;
  }
}
