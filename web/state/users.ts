import { computed, signal } from "@preact/signals";
import { Model } from "shared/model.ts";
import { User } from "shared/user.ts";

export interface Users {
  [connId: string]: Model<typeof User>;
}
export const usersSignal = signal<Users>({});

export const myConnIdSignal = signal("");

export const nicknameSignal = computed(() => {
  const users = usersSignal.value;
  const myConnId = myConnIdSignal.value;
  if (myConnId in users) return users[myConnId].nickname;
  return "";
});
