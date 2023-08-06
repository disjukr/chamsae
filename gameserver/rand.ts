import * as pcg32 from "https://deno.land/x/pcg32@v0.0.1/mod.ts";

export function createSeed(): bigint {
  return BigInt(`0x${
    Array(16).fill(0).map(
      () => Math.round(Math.random() * 0xf).toString(16),
    ).join("")
  }`);
}

export function rand(seed: bigint, state: bigint, seq: bigint = 0n): bigint {
  pcg32.state.value = state;
  pcg32.pcg32_srandom(seed, seq);
  return pcg32.state.value;
}
