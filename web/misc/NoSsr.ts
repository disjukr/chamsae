import { IS_BROWSER } from "$fresh/runtime.ts";

export default function NoSsr({ children }: any) {
  if (!IS_BROWSER) return null;
  return children;
}
