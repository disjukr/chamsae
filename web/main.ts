/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { type ThreeElements } from "@react-three/fiber";

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twindv1.ts";
import twindConfig from "./twind.config.ts";

await start(manifest, { port: 8000, plugins: [twindPlugin(twindConfig)] });

declare global {
  namespace preact.JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
