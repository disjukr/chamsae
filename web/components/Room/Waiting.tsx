import { send } from "../../connection/mod.ts";
import { roomIdSignal, roomSignal } from "../../state/room.ts";

export default function Waiting() {
  const room = roomSignal.value;
  if (!room) return null;
  return (
    <div class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div class="absolute top-0 left-1">
        방 코드: <span class="font-mono">{roomIdSignal}</span>
      </div>
      <div>
        <div>플레이어 목록</div>
        <ul>
          {room.users.map((user) => <li>- {user.connId}</li>)}
        </ul>
      </div>
      <button
        class="px-2 border"
        onClick={() => send({ t: "ready", ready: true })}
      >
        준비하기
      </button>
    </div>
  );
}
