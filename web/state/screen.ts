import { signal } from "@preact/signals";

type Screen = "main";
export const screenSignal = signal<Screen>("main");
