import { Type } from "npm:@sinclair/typebox";
import model from "./model.ts";

export const User = model(
  Type.Object({
    connId: Type.String(),
    nickname: Type.String(),
  }),
);
