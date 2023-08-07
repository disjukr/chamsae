import { ClientMessage } from "../shared/message/client.ts";
import { Model } from "../shared/model.ts";
import { getStore } from "./connection/mod.ts";

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
};
export default handlers;
