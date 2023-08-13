import { addArrayItem, findAndRemoveArrayItem } from "shared/misc/array.ts";
import { send } from "../../connection/mod.ts";
import useHandlers from "../../connection/useHandlers.ts";
import {
  roomIdSignal,
  roomSignal,
  updateRoomUsers,
  updateWaitingPhase,
  waitingRoomUsersSignal,
} from "../../state/room.ts";
import { updateUsers } from "../../state/users.ts";

export default function Waiting() {
  useHandlers({
    "user-joined-to-room"({ user, roomUser }) {
      updateUsers([user]);
      updateRoomUsers((roomUsers) => [...roomUsers, roomUser]);
    },
    "user-left-from-room"({ connId }) {
      updateRoomUsers((roomUsers) => {
        findAndRemoveArrayItem(roomUsers, (item) => item.connId === connId);
        return roomUsers;
      });
    },
    "ready"({ connId }) {
      updateWaitingPhase((waitingPhase) => {
        addArrayItem(waitingPhase.readyUsers, connId);
        return waitingPhase;
      });
    },
  });
  const room = roomSignal.value;
  const roomId = roomIdSignal.value;
  if (!room) return null;
  return (
    <div class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div class="absolute top-0 left-1">
        방 코드: <span class="font-mono">{roomId}</span>
      </div>
      <PlayerList />
      <button
        class="px-2 border"
        onClick={() => send({ t: "ready", ready: true })}
      >
        준비하기
      </button>
    </div>
  );
}

function PlayerList() {
  const waitingRoomUsers = waitingRoomUsersSignal.value;
  return (
    <div>
      <div>플레이어 목록</div>
      <ul class="flex flex-col">
        {waitingRoomUsers.map(({ nickname, isOwner, ready }) => (
          <li class="inline-flex gap-2">
            <span>{nickname}</span>
            {isOwner && <span>(방장)</span>}
            {ready && <span>(준비됨)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
