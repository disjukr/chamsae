export const gameServerLocal = "ws://localhost:8001/";
export const gameserverProd = "wss://gameserver.chamsae.0xabcdef.com/";
export const gameserver = Deno.env.get("GAME_SERVER") || gameserverProd;
