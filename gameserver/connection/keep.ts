import { removeArrayItem } from "../../shared/misc/array.ts";
import { leaveRoom, whichRoom } from "../room.ts";

export function disconnect(
  connId: string,
  secret: string,
  store: any,
): void {
  cemetery.unshift({ connId, secret, store });
  while (cemetery.length > limit) {
    const { connId } = cemetery.pop()!;
    const roomId = whichRoom(connId)!;
    leaveRoom(connId, roomId);
  }
}

export function revive(connId: string, secret: string): Grave | undefined {
  const grave = getGrave(connId);
  if (!grave || (grave.secret !== secret)) return undefined;
  removeArrayItem(cemetery, grave);
  return grave;
}

export function getGrave(connId: string): Grave | undefined {
  return cemetery.find((grave) => grave.connId === connId);
}

const limit = 100;

const cemetery: Grave[] = [];

interface Grave {
  connId: string;
  secret: string;
  store: any;
}
