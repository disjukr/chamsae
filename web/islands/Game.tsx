import Main from "../components/Main/mod.tsx";
import { socketSignal } from "../connection/mod.ts";
import useSocket from "../connection/useSocket.ts";
import { screenSignal } from "../state/screen.ts";

export interface GameProps {
  gameserver: string;
}
export default function Game({ gameserver }: GameProps) {
  const screen = screenSignal.value;
  useSocket(
    gameserver,
    (socket) => (socketSignal.value = socket),
    () => (socketSignal.value = undefined),
  );
  return (
    <div class="absolute inset-0 overflow-hidden">
      {screen === "main" && <Main />}
    </div>
  );
}
