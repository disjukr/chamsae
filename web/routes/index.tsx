import { Head } from "$fresh/runtime.ts";
import { gameserver } from "../config/gameserver.ts";
import Root from "../islands/Root.tsx";

export default function Page() {
  return (
    <>
      <Head>
        <title>𓅪</title>
      </Head>
      <Root gameserver={gameserver} />
    </>
  );
}
