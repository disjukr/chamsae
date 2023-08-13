import { computed, signal } from "@preact/signals";
import type { Model } from "shared/model.ts";
import type { User } from "shared/user.ts";

export interface Users {
  [connId: string]: Model<typeof User>;
}
export const usersSignal = signal<Users>({});
export function updateUsers(users: Model<typeof User>[]): void {
  const newUsers: Users = { ...usersSignal.value };
  for (const user of users) newUsers[user.connId] = user;
  usersSignal.value = newUsers;
}

export const myConnIdSignal = signal("");

export const nicknameSignal = computed(() => {
  const users = usersSignal.value;
  const myConnId = myConnIdSignal.value;
  if (myConnId in users) return users[myConnId].nickname;
  return "";
});
