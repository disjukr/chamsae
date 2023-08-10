import { Type } from "npm:@sinclair/typebox";
import model from "./model.ts";

export const Role = model(
  Type.Union([Type.Literal("player"), Type.Literal("viewer")]),
);

export const RoomUser = model(
  Type.Object({
    connId: Type.String(),
    role: Role.schema,
  }),
);

export const Room = model(
  Type.Object({
    users: Type.Array(RoomUser.schema),
  }),
);
