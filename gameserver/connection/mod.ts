import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { ServerMessage } from "../../shared/message/server.ts";
import { checkSecret, disconnect } from "./secret.ts";

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
    if (checkSecret(connId, secret)) return _connect(socket, connId, secret);
  }
  return _connect(socket);
}

export class ReconnectionError extends Error {}

export function send(socket: WebSocket, message: ServerMessage) {
  socket.send(JSON.stringify(message));
}

export function getId(socket: WebSocket): string | undefined {
  return socket2id.get(socket);
}

export function getSocket(id: string): WebSocket | undefined {
  return id2socket.get(id);
}

const id2socket = new Map<string, WebSocket>();
const socket2id = new Map<WebSocket, string>();

function _connect(
  socket: WebSocket,
  _connId?: string,
  secret: string = nanoid(),
): Promise<ConnectResult> {
  return new Promise((resolve) => {
    socket.addEventListener("open", () => {
      const connId = _connId || newConnId();
      id2socket.set(connId, socket);
      socket2id.set(socket, connId);
      resolve({ connId, secret });
    });
    socket.addEventListener("close", () => {
      const connId = socket2id.get(socket)!;
      id2socket.delete(connId);
      socket2id.delete(socket);
      disconnect(connId, secret);
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
