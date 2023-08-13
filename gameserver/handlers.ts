import { ClientMessage } from "../shared/message/client.ts";
import { addArrayItem, removeArrayItem } from "../shared/misc/array.ts";
import { Model } from "../shared/model.ts";
import { getStore, send } from "./connection/mod.ts";
import { broadcast, createRoom, getRoom, joinRoom, whichRoom } from "./room.ts";

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
  "noop"() {},
  "change-nickname"({ nickname }, { socket, connId }) {
    const store = getStore(socket)!;
    store.nickname = nickname;
    const roomId = whichRoom(connId);
    if (roomId) {
      broadcast(roomId, { t: "nickname-changed", connId, nickname });
    } else {
      send(socket, { t: "nickname-changed", connId, nickname });
    }
  },
  "create-room-request"({ requestId }, { socket, connId }) {
    send(socket, {
      t: "create-room-response",
      requestId,
      result: createRoom(connId),
    });
  },
  "join-room-request"({ requestId, roomId }, { socket, connId }) {
    send(socket, {
      t: "join-room-response",
      requestId,
      result: joinRoom(connId, roomId),
    });
  },
  "ready"({ ready }, { connId }) {
    const roomId = whichRoom(connId);
    if (!roomId) return;
    const room = getRoom(roomId)!;
    if (room.phase.t !== "waiting") return;
    if (ready) {
      addArrayItem(room.phase.readyUsers, connId);
    } else {
      removeArrayItem(room.phase.readyUsers, connId);
    }
    broadcast(roomId, { t: "ready", connId, ready });
  },
};
export default handlers;
