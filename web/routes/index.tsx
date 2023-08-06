import { Head } from "$fresh/runtime.ts";
import { gameserver } from "../config/gameserver.ts";
import Game from "../islands/Game.tsx";

export default function Page() {
  return (
    <>
      <Head>
        <title>참새</title>
      </Head>
      <Game gameserver={gameserver} />
    </>
  );
}
