import { getNumber, groupTiles, sortTiles, Tile } from "./mod.ts";

export type CalcResult = CalcResultBonus | CalcResultYakuman;
interface CalcResultBase {
  pair: [Body, Body];
}
export interface CalcResultBonus extends CalcResultBase {
  type: "bonus";
  reds: number;
  dora: boolean;
  tanyao: boolean;
  chanta: boolean;
}
export interface CalcResultYakuman extends CalcResultBase {
  type: "yakuman";
  yakuman: "all-green" | "chinyao" | "super-red";
}
export type HandTiles = [Tile, Tile, Tile, Tile, Tile, Tile];
export default function calc(
  dora: Tile,
  handTiles: HandTiles,
): CalcResult | undefined {
  const pair = makePair(handTiles);
  if (!pair) return undefined;
  // TODO
  return { pair, type: "yakuman", yakuman: "all-green" };
}

export type Body = [Tile, Tile, Tile];
export type Pair = [Body, Body];
export function makePair(
  handTiles: HandTiles,
): Pair | undefined {
  const sortedTiles = sortTiles(handTiles);
  const groupedTiles = groupTiles(sortedTiles);
  if (
    groupedTiles.length === 2 &&
    groupedTiles[0].length === 3 &&
    groupedTiles[1].length === 3
  ) return groupedTiles as Pair;
  const melded = groupedTiles.filter(
    (group) => group.length >= 3,
  )?.[0].slice(0, 3) as Body;
  if (melded) {
    const other = sortedTiles.filter((tile) => !melded.includes(tile)) as Body;
    if (isChow(other)) return [melded, other];
  }
  // TODO
  return;
}

export function isMeld(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return (a === b) && (b === c);
}

export function isChow(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return ((b - a) === 1) && ((c - b) === 1);
}
