import { useSignal } from "@preact/signals";
import { send, socketSignal } from "../../connection/mod.ts";
import { nicknameSignal } from "../../state/users.ts";

export default function ConnectionInfo() {
  const changeNicknameSignal = useSignal(false);
  const socket = socketSignal.value;
  if (!socket) return <>게임 서버에 연결 중입니다...</>;
  return (
    <div class="flex flex-col gap-1">
      <div>연결됨: {nicknameSignal}</div>
      {changeNicknameSignal.value
        ? <ChangeNickname close={() => changeNicknameSignal.value = false} />
        : (
          <button
            class="border"
            onClick={() => changeNicknameSignal.value = true}
          >
            별명 바꾸기
          </button>
        )}
    </div>
  );
}

function ChangeNickname(props: { close: () => void }) {
  const newNicknameSignal = useSignal(nicknameSignal.value);
  const submit = () => {
    send({ t: "update-nickname", nickname: newNicknameSignal.value });
    props.close();
  };
  return (
    <div class="flex flex-col gap-2">
      <div>
        새 별명:{" "}
        <input
          class="border"
          type="text"
          value={newNicknameSignal.value}
          onInput={(e) => newNicknameSignal.value = e.currentTarget.value}
        />
      </div>
      <button class="border px-2" onClick={submit}>
        적용
      </button>
    </div>
  );
}
