import { Head } from "$fresh/runtime.ts";

export default function Page() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="py-16 flex flex-col gap-8 text-center">
        <h1 class="text-4xl font-bold">404 - Page not found</h1>
        <a href="/" class="underline">Go back home</a>
      </div>
    </>
  );
}
