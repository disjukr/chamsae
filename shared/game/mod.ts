// deno-fmt-ignore
export const tiles = Object.freeze([
  // green * 3
  "a🀄", "a🀅", "a🀐", "a🀑", "a🀒", "a🀓", "a🀔", "a🀕", "a🀖", "a🀗", "a🀘",
  "b🀄", "b🀅", "b🀐", "b🀑", "b🀒", "b🀓", "b🀔", "b🀕", "b🀖", "b🀗", "b🀘",
  "c🀄", "c🀅", "c🀐", "c🀑", "c🀒", "c🀓", "c🀔", "c🀕", "c🀖", "c🀗", "c🀘",
  // red
  "r🀄", "r🀅", "r🀐", "r🀑", "r🀒", "r🀓", "r🀔", "r🀕", "r🀖", "r🀗", "r🀘",
] as const);

export type Tile = (typeof tiles)[number];

const one = "🀐".codePointAt(0)!;

// -11(🀄), -10(🀅), 1(🀐) ~ 9(🀘)
export function getNumber(tile: Tile): number {
  return tile.codePointAt(1)! - one + 1;
}

export function sortTiles<T extends Tile[]>(tiles: T): T {
  const result = tiles.slice() as T;
  result.sort(); // alphanumeric
  result.sort((a, b) => getNumber(a) - getNumber(b)); // ascending
  return result;
}

export interface TileGroup {
  [number: number]: Tile[];
}
export function groupTiles(tiles: Tile[]): TileGroup {
  const group: TileGroup = {};
  for (const tile of tiles) (group[getNumber(tile)] ||= []).push(tile);
  return group;
}

export function isYaochuuhai(tile: Tile): boolean {
  const number = getNumber(tile);
  return (number <= 1) || (number >= 9);
}

export function isGreen(tile: Tile): boolean {
  if (isRed(tile)) return false;
  const number = getNumber(tile);
  return number === 3 || !(number % 2);
}

export function isRed(tile: Tile): boolean {
  return tile[0] === "r" || tile.slice(1) === "🀄";
}
