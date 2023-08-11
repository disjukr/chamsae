import { socketSignal } from "../connection/mod.ts";
import useSocket from "../connection/useSocket.ts";

export interface GameProps {
  gameserver: string;
}
export default function Game({ gameserver }: GameProps) {
  useSocket(
    gameserver,
    (socket) => (socketSignal.value = socket),
    () => (socketSignal.value = undefined),
  );
  return (
    <div>
      hello
    </div>
  );
}
