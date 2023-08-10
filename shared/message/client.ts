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

export const CreateRoomRequest = model(
  Type.Object({
    t: Type.Literal("create-room-request"),
    requestId: Type.String(),
  }),
);

export const JoinRoomRequest = model(
  Type.Object({
    t: Type.Literal("join-room-request"),
    requestId: Type.String(),
    roomId: Type.String(),
  }),
);

export const ClientMessage = model(
  Type.Union([
    Noop.schema,
    UpdateNickname.schema,
    CreateRoomRequest.schema,
    JoinRoomRequest.schema,
  ], { discriminator: { propertyName: "t" } }),
);
