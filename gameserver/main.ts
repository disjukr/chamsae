import { ClientMessage } from "../shared/message/client.ts";
import { connect, ReconnectionInfo, send } from "./connection/mod.ts";
import handlers, { Handler } from "./handlers.ts";
import { getUser } from "./user.ts";

Deno.serve({ port: 8001 }, async (req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);
  const url = new URL(req.url);
  const { connId, secret } = await connect({
    socket,
    reconnect: getReconnectionInfo(url),
  });
  send(socket, { t: "hello", connId, secret, me: getUser(connId)! });
  socket.addEventListener("message", (e) => {
    const clientMessage = JSON.parse(e.data);
    if (!ClientMessage.validate(clientMessage)) {
      throw new Error(`Invalid client message: ${e.data}`);
    }
    (handlers[clientMessage.t] as Handler)(clientMessage, { socket, connId });
  });
  return response;
});

globalThis.addEventListener("unhandledrejection", (e) => {
  if (e.reason instanceof Error) console.log(e.reason.stack);
});

function getReconnectionInfo(url: URL): ReconnectionInfo | undefined {
  const connId = url.searchParams.get("connId");
  const secret = url.searchParams.get("secret");
  if (!connId || !secret) return;
  return { connId, secret };
}
