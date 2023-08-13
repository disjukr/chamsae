import { signal } from "@preact/signals";

export type Screen = "fail" | "setup" | "main" | "room";
export const screenSignal = signal<Screen>("setup");
