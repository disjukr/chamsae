import { Model } from "../shared/model.ts";
import { User } from "../shared/user.ts";
import { Get, getFn } from "./connection/store.ts";

let i = 0;
export const getUser = getFn({
  nickname: () => `Guest ${i++}`,
}) satisfies Get<Model<typeof User>>;
