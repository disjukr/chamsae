import { signal } from "@preact/signals";

export type Screen = "fail" | "main";
export const screenSignal = signal<Screen>("main");
