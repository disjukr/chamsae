import { Head } from "$fresh/runtime.ts";
import R3fTest from "../islands/R3fTest.tsx";

export default function Page() {
  return (
    <>
      <Head>
        <title>r3f-test</title>
      </Head>
      <div class="w-full h-[100vh]">
        <R3fTest />
      </div>
    </>
  );
}
