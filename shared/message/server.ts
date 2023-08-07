import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";
import { User } from "../user.ts";

export const Noop = model(
  Type.Object({
    t: Type.Literal("noop"),
  }),
);

export const Hello = model(
  Type.Object({
    t: Type.Literal("hello"),
    connId: Type.String(),
    secret: Type.String(),
    me: User.schema,
  }),
);

export const NicknameChanged = model(
  Type.Object({
    t: Type.Literal("nickname-changed"),
    connId: Type.String(),
    nickname: Type.String(),
  }),
);

export const ServerMessage = model(
  Type.Union([
    Noop.schema,
    Hello.schema,
    NicknameChanged.schema,
  ], { discriminator: { propertyName: "t" } }),
);
