import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";
import { User } from "../user.ts";
import { CreateRoomResult, JoinRoomResult, Room, RoomUser } from "../room.ts";

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

export const CreateRoomResponse = model(
  Type.Object({
    t: Type.Literal("create-room-response"),
    requestId: Type.String(),
    result: CreateRoomResult.schema,
  }),
);

export const JoinRoomResponse = model(
  Type.Object({
    t: Type.Literal("join-room-response"),
    requestId: Type.String(),
    result: JoinRoomResult.schema,
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

export const Ready = model(
  Type.Object({
    t: Type.Literal("ready"),
    connId: Type.String(),
    ready: Type.Boolean(),
  }),
);

export const ServerMessage = model(
  Type.Union([
    Noop.schema,
    Hello.schema,
    NicknameChanged.schema,
    CreateRoomResponse.schema,
    JoinRoomResponse.schema,
    UserJoinedToRoom.schema,
    UserLeftFromRoom.schema,
    Ready.schema,
  ], { discriminator: { propertyName: "t" } }),
);
