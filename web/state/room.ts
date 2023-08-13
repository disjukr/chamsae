import { signal } from "@preact/signals";
import type { Model } from "shared/model.ts";
import type { Room } from "shared/room.ts";

export const roomIdSignal = signal("");
export const roomSignal = signal<Model<typeof Room> | undefined>(undefined);
