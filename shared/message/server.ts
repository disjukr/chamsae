import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";
import { User } from "../user.ts";
import { Room, RoomUser } from "../room.ts";

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

export const NicknameUpdated = model(
  Type.Object({
    t: Type.Literal("nickname-updated"),
    connId: Type.String(),
    nickname: Type.String(),
  }),
);

export const CreateRoomResponse = model(
  Type.Object({
    t: Type.Literal("create-room-response"),
    requestId: Type.String(),
    result: Type.Object({
      roomId: Type.String(),
      room: Room.schema,
    }),
  }),
);

export const JoinRoomResponse = model(
  Type.Object({
    t: Type.Literal("join-room-response"),
    requestId: Type.String(),
    result: Type.Union([
      Type.Object({
        success: Type.Literal(true),
        room: Room.schema,
      }),
      Type.Object({
        success: Type.Literal(false),
        reason: Type.Union([
          Type.Literal("not-found"),
        ]),
      }),
    ]),
  }),
);

export const UserJoinedToRoom = model(
  Type.Object({
    t: Type.Literal("user-joined-to-room"),
    roomUser: RoomUser.schema,
  }),
);

export const UserLeftFromRoom = model(
  Type.Object({
    t: Type.Literal("user-left-from-room"),
    connId: Type.String(),
  }),
);

export const ServerMessage = model(
  Type.Union([
    Noop.schema,
    Hello.schema,
    NicknameUpdated.schema,
    CreateRoomResponse.schema,
    JoinRoomResponse.schema,
    UserJoinedToRoom.schema,
    UserLeftFromRoom.schema,
  ], { discriminator: { propertyName: "t" } }),
);
