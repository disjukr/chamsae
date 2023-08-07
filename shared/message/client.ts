import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";

export const Noop = model(
  Type.Object({
    t: Type.Literal("noop"),
  }),
);

export const UpdateNickname = model(
  Type.Object({
    t: Type.Literal("update-nickname"),
    nickname: Type.String(),
  }),
);

export const ClientMessage = model(
  Type.Union([
    Noop.schema,
    UpdateNickname.schema,
  ], { discriminator: { propertyName: "t" } }),
);
