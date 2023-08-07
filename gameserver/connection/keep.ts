export function disconnect(
  connId: string,
  secret: string,
  store: any,
): void {
  cemetery.unshift({ connId, secret, store });
  if (cemetery.length > limit) cemetery.length = limit;
}

export function revive(connId: string, secret: string): Grave | undefined {
  const grave = cemetery.find((grave) => grave.secret === secret);
  if (!grave || (grave.connId !== connId)) return undefined;
  return grave;
}

const limit = 100;

const cemetery: Grave[] = [];

interface Grave {
  connId: string;
  secret: string;
  store: any;
}
