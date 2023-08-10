import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/customAlphabet.ts";
import { ServerMessage } from "../shared/message/server.ts";
import { Model } from "../shared/model.ts";
import { Room, RoomUser } from "../shared/room.ts";
import { getSocket, send } from "./connection/mod.ts";

const rooms = new Map<string, Model<typeof Room>>();

export interface CreateRoomResult {
  roomId: string;
  room: Model<typeof Room>;
}
export function createRoom(connId: string): CreateRoomResult {
  const roomId = newRoomId();
  const room: Model<typeof Room> = {
    users: [{ connId, role: "player" }],
  };
  rooms.set(roomId, room);
  return { roomId, room };
}

export type JoinRoomResult = JoinRoomSuccess | JoinRoomFail;
export interface JoinRoomSuccess {
  success: true;
  room: Model<typeof Room>;
}
export interface JoinRoomFail {
  success: false;
  reason: "not-found";
}
export function joinRoom(connId: string, roomId: string): JoinRoomResult {
  const room = rooms.get(roomId);
  if (!room) return { success: false, reason: "not-found" };
  const roomUser: Model<typeof RoomUser> = { connId, role: "player" };
  room.users.push(roomUser);
  broadcast(roomId, { t: "user-joined-to-room", roomUser });
  return { success: true, room };
}

export function broadcast(
  roomId: string,
  message: Model<typeof ServerMessage>,
): void {
  const room = rooms.get(roomId);
  if (!room) return;
  for (const user of room.users) {
    const socket = getSocket(user.connId);
    if (!socket) continue;
    send(socket, message);
  }
}

const atoz = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(atoz, 5);
function newRoomId(): string {
  while (true) {
    const connId = nanoid();
    if (rooms.has(connId)) continue;
    return connId;
  }
}
