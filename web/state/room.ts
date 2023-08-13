import { computed, signal } from "@preact/signals";
import type { Model } from "shared/model.ts";
import { Room, RoomUser, WaitingPhase } from "shared/room.ts";
import { usersSignal } from "./users.ts";

export const roomIdSignal = signal("");

export const roomSignal = signal<Model<typeof Room> | undefined>(undefined);

export function updateRoom(
  updateFn: (room: Model<typeof Room>) => Model<typeof Room>,
) {
  if (!roomSignal.value) return;
  roomSignal.value = updateFn(roomSignal.value);
}

export function updateWaitingPhase(
  updateFn: (
    waitingPhase: Model<typeof WaitingPhase>,
  ) => Model<typeof WaitingPhase>,
) {
  updateRoom((room) => {
    if (room.phase.t !== "waiting") return room;
    return { ...room, phase: updateFn(room.phase) };
  });
}

export type RoomUsers = Model<typeof RoomUser>[];
export function updateRoomUsers(updateFn: (roomUsers: RoomUsers) => RoomUsers) {
  updateRoom((room) => ({ ...room, users: updateFn(room.users) }));
}

export interface WaitingRoomUser {
  connId: string;
  nickname: string;
  ready: boolean;
  isOwner: boolean;
}
export const waitingRoomUsersSignal = computed<WaitingRoomUser[]>(() => {
  const room = roomSignal.value;
  const users = usersSignal.value;
  if (!room || room.phase.t !== "waiting") return [];
  return room.users.map(({ connId }) => ({
    connId,
    nickname: users[connId]?.nickname || "",
    ready: room.phase.readyUsers.includes(connId),
    isOwner: room.ownerConnId === connId,
  }));
});
