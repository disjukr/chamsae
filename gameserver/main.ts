import { connect, ReconnectionInfo, send } from "./connection/mod.ts";

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
  send(socket, { t: "hello", connId, secret });
  socket.addEventListener("message", (e) => {
    if (e.data === "ping") {
      socket.send("pong");
    }
  });
  return response;
});

function getReconnectionInfo(url: URL): ReconnectionInfo | undefined {
  const connId = url.searchParams.get("connId");
  const secret = url.searchParams.get("secret");
  if (!connId || !secret) return;
  return { connId, secret };
}
