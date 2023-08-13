import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/customAlphabet.ts";
import { ServerMessage } from "../shared/message/server.ts";
import { Model } from "../shared/model.ts";
import { JoinRoomResult, Room, RoomUser } from "../shared/room.ts";
import { getSocket, send } from "./connection/mod.ts";
import { findAndRemoveArrayItem } from "../shared/misc/array.ts";

const rooms = new Map<string, Model<typeof Room>>();
const connid2roomid = new Map<string, string>();

export function getRoom(roomId: string): Model<typeof Room> | undefined {
  return rooms.get(roomId);
}

export function whichRoom(connId: string): string | undefined {
  return connid2roomid.get(connId);
}

export interface CreateRoomResult {
  roomId: string;
  room: Model<typeof Room>;
}
export function createRoom(connId: string): CreateRoomResult {
  const roomId = newRoomId();
  const room: Model<typeof Room> = {
    ownerConnId: connId,
    users: [{ connId }],
    phase: {
      t: "waiting",
      readyUsers: [],
    },
  };
  rooms.set(roomId, room);
  connid2roomid.set(connId, roomId);
  return { roomId, room };
}

export function joinRoom(
  connId: string,
  roomId: string,
): Model<typeof JoinRoomResult> {
  const room = rooms.get(roomId);
  if (!room) return { success: false, reason: "not-found" };
  if (room.users.length >= 5) return { success: false, reason: "no-seats" };
  const roomUser: Model<typeof RoomUser> = { connId };
  broadcast(roomId, { t: "user-joined-to-room", roomUser });
  connid2roomid.set(connId, roomId);
  room.users.push(roomUser);
  return { success: true, room };
}

export function leaveRoom(connId: string, roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;
  const removed = findAndRemoveArrayItem(
    room.users,
    (user) => user.connId === connId,
  );
  if (removed) return;
  connid2roomid.delete(connId);
  if (room.users.length) {
    broadcast(roomId, { t: "user-left-from-room", connId });
  } else {
    rooms.delete(roomId);
  }
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
