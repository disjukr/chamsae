import Fail from "../components/Fail/mod.tsx";
import Main from "../components/Main/mod.tsx";
import Setup from "../components/Setup/mod.tsx";
import { socketSignal } from "../connection/mod.ts";
import useSocket from "../connection/useSocket.ts";
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
      onTouchEndCapture={triggerFullscreen}
    >
      {screens[screen]}
    </div>
  );
}

const screens: { [type in Screen]: any } = {
  "fail": <Fail />,
  "main": <Main />,
  "setup": <Setup />,
};

async function triggerFullscreen() {
  if (document.fullscreenElement) return;
  await document.documentElement.requestFullscreen({
    navigationUI: "hide",
  });
  window.screen.orientation.lock("landscape");
}
