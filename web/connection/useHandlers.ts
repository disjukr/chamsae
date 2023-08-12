import { useEffect } from "preact/hooks";
import { Model } from "shared/model.ts";
import { ServerMessage } from "shared/message/server.ts";
import { on } from "./mod.ts";

export default function useHandlers(handlers: Partial<Handlers>) {
  useEffect(() =>
    on((message) => {
      const { t } = message;
      if (t in handlers) (handlers[t] as Handler)(message);
    }), []);
}

type ServerMessageType = Model<typeof ServerMessage>["t"];
type Handlers = {
  [key in ServerMessageType]: <
    T extends Model<typeof ServerMessage> & { t: key },
  >(message: T) => void;
};
type Handler = (message: Model<typeof ServerMessage>) => void;
