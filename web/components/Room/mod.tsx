import { roomSignal } from "../../state/room.ts";
import Waiting from "./Waiting.tsx";

export default function Room() {
  const room = roomSignal.value;
  if (!room) return null;
  switch (room.phase.t) {
    case "waiting":
      return <Waiting />;
  }
}
