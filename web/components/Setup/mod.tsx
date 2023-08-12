import { useSignal } from "@preact/signals";
import { send } from "../../connection/mod.ts";
import {
  myConnIdSignal,
  nicknameSignal,
  usersSignal,
} from "../../state/users.ts";
import { screenSignal } from "../../state/screen.ts";
import useHandlers from "../../connection/useHandlers.ts";

export default function Setup() {
  const connectingSignal = useSignal(true);
  const connecting = connectingSignal.value;
  useHandlers({
    "hello"({ me }) {
      const myConnId = me.connId;
      myConnIdSignal.value = myConnId;
      usersSignal.value = { ...usersSignal.value, [myConnId]: me };
      connectingSignal.value = false;
    },
    "nickname-updated"({ connId, nickname }) {
      const user = usersSignal.value[connId];
      if (!user) return;
      usersSignal.value = { [connId]: { ...user, nickname } };
      screenSignal.value = "main";
    },
  });
  return connecting ? <Connecting /> : <UpdateNickname />;
}

function Connecting() {
  return (
    <div class="w-full h-full flex items-center justify-center">
      <div>게임 서버에 연결하는 중입니다...</div>
    </div>
  );
}

function UpdateNickname() {
  const newNicknameSignal = useSignal(nicknameSignal.value);
  return (
    <div class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <h1 class="text-center text-5xl font-bold">𓅪</h1>
      <div class="p-6 flex flex-col gap-4 border">
        <h1>별명을 입력해주세요</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send({ t: "update-nickname", nickname: newNicknameSignal.value });
          }}
        >
          별명:{" "}
          <input
            class="border"
            type="text"
            value={newNicknameSignal.value}
            onInput={(e) => newNicknameSignal.value = e.currentTarget.value}
          />
          <button class="border px-2">
            확인
          </button>
        </form>
      </div>
    </div>
  );
}
