import { Type } from "npm:@sinclair/typebox";
import model from "./model.ts";
import { User } from "./user.ts";

export const RoomUser = model(
  Type.Object({
    connId: Type.String(),
  }),
);

export const WaitingPhase = model(
  Type.Object({
    t: Type.Literal("waiting"),
    readyUsers: Type.Array(Type.String()),
  }),
);

export const Room = model(
  Type.Object({
    ownerConnId: Type.String(),
    users: Type.Array(RoomUser.schema),
    phase: Type.Union([WaitingPhase.schema]),
  }),
);

export const CreateRoomSuccess = model(
  Type.Object({
    success: Type.Literal(true),
    roomId: Type.String(),
    room: Room.schema,
  }),
);

export const CreateRoomFail = model(
  Type.Object({
    success: Type.Literal(false),
    reason: Type.Union([
      Type.Literal("already-in-another-room"),
    ]),
  }),
);

export const CreateRoomResult = model(
  Type.Union([
    CreateRoomSuccess.schema,
    CreateRoomFail.schema,
  ]),
);

export const JoinRoomSuccess = model(
  Type.Object({
    success: Type.Literal(true),
    roomId: Type.String(),
    room: Room.schema,
    users: Type.Array(User.schema),
  }),
);

export const JoinRoomFail = model(
  Type.Object({
    success: Type.Literal(false),
    reason: Type.Union([
      Type.Literal("not-found"),
      Type.Literal("no-seats"),
    ]),
  }),
);

export const JoinRoomResult = model(
  Type.Union([
    JoinRoomSuccess.schema,
    JoinRoomFail.schema,
  ]),
);
