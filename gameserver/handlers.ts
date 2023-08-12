import { ClientMessage } from "../shared/message/client.ts";
import { Model } from "../shared/model.ts";
import { getConnId, getStore, send } from "./connection/mod.ts";
import { broadcast, createRoom, joinRoom, whichRoom } from "./room.ts";

type ClientMessageType = Model<typeof ClientMessage>["t"];
interface Context {
  socket: WebSocket;
  connId: string;
}
type Handlers = {
  [key in ClientMessageType]: <
    T extends Model<typeof ClientMessage> & { t: key },
  >(message: T, ctx: Context) => void;
};

export type Handler = (
  message: Model<typeof ClientMessage>,
  ctx: Context,
) => void;

const handlers: Handlers = {
  "noop": () => {},
  "update-nickname": ({ nickname }, { socket, connId }) => {
    const store = getStore(socket)!;
    store.nickname = nickname;
    const roomId = whichRoom(connId);
    if (roomId) {
      broadcast(roomId, { t: "nickname-updated", connId, nickname });
    } else {
      send(socket, { t: "nickname-updated", connId, nickname });
    }
  },
  "create-room-request": ({ requestId }, { socket }) => {
    const connId = getConnId(socket)!;
    send(socket, {
      t: "create-room-response",
      requestId,
      result: createRoom(connId),
    });
  },
  "join-room-request": ({ requestId, roomId }, { socket, connId }) => {
    send(socket, {
      t: "join-room-response",
      requestId,
      result: joinRoom(connId, roomId),
    });
  },
};
export default handlers;
