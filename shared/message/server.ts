import { Type } from "npm:@sinclair/typebox";
import model, { Model } from "../model.ts";

export type ServerMessage = Model<typeof Hello>;

export const Hello = model(
  Type.Object({
    t: Type.Literal("hello"),
    connId: Type.String(),
    secret: Type.String(),
  }),
);
