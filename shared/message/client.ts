import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";

export const Noop = model(
  Type.Object({
    t: Type.Literal("noop"),
  }),
);

export const ChangeNickname = model(
  Type.Object({
    t: Type.Literal("change-nickname"),
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

export const Ready = model(
  Type.Object({
    t: Type.Literal("ready"),
    ready: Type.Boolean(),
  }),
);

export const ClientMessage = model(
  Type.Union([
    Noop.schema,
    ChangeNickname.schema,
    CreateRoomRequest.schema,
    JoinRoomRequest.schema,
    Ready.schema,
  ], { discriminator: { propertyName: "t" } }),
);
