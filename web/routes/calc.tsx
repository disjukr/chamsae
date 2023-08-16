import { Head } from "$fresh/runtime.ts";
import Calc from "../islands/Calc.tsx";

export default function Page() {
  return (
    <>
      <Head>
        <title>𓅪 점수 계산기</title>
      </Head>
      <Calc />
    </>
  );
}
