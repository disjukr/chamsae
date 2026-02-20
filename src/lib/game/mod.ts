export const tiles = Object.freeze([
  "a🀄",
  "a🀅",
  "a🀐",
  "a🀑",
  "a🀒",
  "a🀓",
  "a🀔",
  "a🀕",
  "a🀖",
  "a🀗",
  "a🀘",
  "b🀄",
  "b🀅",
  "b🀐",
  "b🀑",
  "b🀒",
  "b🀓",
  "b🀔",
  "b🀕",
  "b🀖",
  "b🀗",
  "b🀘",
  "c🀄",
  "c🀅",
  "c🀐",
  "c🀑",
  "c🀒",
  "c🀓",
  "c🀔",
  "c🀕",
  "c🀖",
  "c🀗",
  "c🀘",
  "r🀄",
  "r🀅",
  "r🀐",
  "r🀑",
  "r🀒",
  "r🀓",
  "r🀔",
  "r🀕",
  "r🀖",
  "r🀗",
  "r🀘",
] as const);

export type Tile = (typeof tiles)[number];

const oneCodePoint = "🀐".codePointAt(0);
if (oneCodePoint === undefined) {
  throw new Error("Failed to initialize tile code point");
}
const one = oneCodePoint;

export function getNumber(tile: Tile): number {
  const code = tile.codePointAt(1);
  if (code === undefined) {
    throw new Error(`Invalid tile: ${tile}`);
  }
  return code - one + 1;
}

export function sortTiles(input: readonly Tile[]): Tile[] {
  const result = [...input];
  result.sort();
  result.sort((a, b) => getNumber(a) - getNumber(b));
  return result;
}

export type TileGroup = Record<number, Tile[]>;

export function groupTiles(input: readonly Tile[]): TileGroup {
  const group: TileGroup = {};
  for (const tile of input) {
    const number = getNumber(tile);
    if (!group[number]) {
      group[number] = [];
    }
    group[number].push(tile);
  }
  return group;
}

export function isYaochuuhai(tile: Tile): boolean {
  const number = getNumber(tile);
  return number <= 1 || number >= 9;
}

export function isGreen(tile: Tile): boolean {
  if (isRed(tile)) {
    return false;
  }
  const number = getNumber(tile);
  return number === 3 || number % 2 === 0;
}

export function isRed(tile: Tile): boolean {
  return tile[0] === "r" || tile.slice(1) === "🀄";
}
