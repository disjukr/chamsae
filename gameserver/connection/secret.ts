export function disconnect(id: string, secret: string): void {
  pairs.unshift({ id, secret });
  if (pairs.length > limit) pairs.length = limit;
}

export function checkSecret(id: string, secret: string): boolean {
  const pair = pairs.find((pair) => pair.secret === secret);
  if (!pair) return false;
  return pair.id === id;
}

const limit = 100;

const pairs: SecretPair[] = [];

interface SecretPair {
  id: string;
  secret: string;
}
