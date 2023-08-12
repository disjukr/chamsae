import { nicknameSignal } from "../../state/users.ts";

export default function Main() {
  return (
    <div class="w-full h-full flex flex-col gap-4 items-center justify-center">
      <div class="absolute top-0 left-0 px-1">
        <span class="px-1 rounded bg-[rgb(226,232,240)]">{nicknameSignal}
        </span>님 안녕하세요!
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
