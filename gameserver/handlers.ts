import { ClientMessage } from "../shared/message/client.ts";
import { Model } from "../shared/model.ts";
import { getConnId, getStore, send } from "./connection/mod.ts";
import { createRoom, joinRoom } from "./room.ts";

type ClientMessageType = Model<typeof ClientMessage>["t"];
type Handlers = {
  [key in ClientMessageType]: <
    T extends Model<typeof ClientMessage> & { t: key },
  >(message: T, socket: WebSocket) => void;
};

export type Handler = (
  message: Model<typeof ClientMessage>,
  socket: WebSocket,
) => void;

const handlers: Handlers = {
  "noop": () => {},
  "update-nickname": (message, socket) => {
    const store = getStore(socket)!;
    store.nickname = message.nickname;
  },
  "create-room-request": ({ requestId }, socket) => {
    const connId = getConnId(socket)!;
    send(socket, {
      t: "create-room-response",
      requestId,
      result: createRoom(connId),
    });
  },
  "join-room-request": ({ requestId, roomId }, socket) => {
    const connId = getConnId(socket)!;
    send(socket, {
      t: "join-room-response",
      requestId,
      result: joinRoom(connId, roomId),
    });
  },
};
export default handlers;
