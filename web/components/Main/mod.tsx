import useHandlers from "../../connection/useHandlers.ts";
import { myConnIdSignal, usersSignal } from "../../state/users.ts";
import ConnectionInfo from "./ConnectionInfo.tsx";

export default function Main() {
  useHandlers({
    "hello"({ me }) {
      const myConnId = me.connId;
      myConnIdSignal.value = myConnId;
      usersSignal.value = { ...usersSignal.value, [myConnId]: me };
    },
    "nickname-updated"({ connId, nickname }) {
      const user = usersSignal.value[connId];
      if (!user) return;
      usersSignal.value = { [connId]: { ...user, nickname } };
    },
  });
  return (
    <div class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div class="absolute top-0 right-0 px-1">
        <ConnectionInfo />
      </div>
      <h1 class="text-center text-5xl font-bold">𓅪</h1>
      <div class="inline-flex flex-col gap-2">
        <button class="p-2 border">방 만들기</button>
        <span>또는...</span>
        <button class="p-2 border">방 참여하기</button>
      </div>
    </div>
  );
}
