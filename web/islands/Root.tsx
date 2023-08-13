import Fail from "../components/Fail/mod.tsx";
import Main from "../components/Main/mod.tsx";
import Room from "../components/Room/mod.tsx";
import Setup from "../components/Setup/mod.tsx";
import { socketSignal } from "../connection/mod.ts";
import useSocket from "../connection/useSocket.ts";
import { triggerFullscreen } from "../misc/fullscreen.ts";
import { Screen, screenSignal } from "../state/screen.ts";

export interface RootProps {
  gameserver: string;
}
export default function Root({ gameserver }: RootProps) {
  const screen = screenSignal.value;
  useSocket(
    gameserver,
    (socket) => (socketSignal.value = socket),
    () => (socketSignal.value = undefined),
    () => {
      screenSignal.value = "fail";
      socketSignal.value = undefined;
    },
  );
  return (
    <div
      class="absolute inset-0 overflow-hidden"
      onTouchEndCapture={screen !== "setup" ? triggerFullscreen : undefined}
    >
      {screens[screen]}
    </div>
  );
}

const screens: { [type in Screen]: any } = {
  "fail": <Fail />,
  "main": <Main />,
  "room": <Room />,
  "setup": <Setup />,
};
