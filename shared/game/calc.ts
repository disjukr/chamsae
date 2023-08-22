import {
  getNumber,
  groupTiles,
  isGreen,
  isRed,
  isYaochuuhai,
  sortTiles,
  Tile,
} from "./mod.ts";

export type CalcResult = CalcResultBonus | CalcResultYakuman;
interface CalcResultBase {
  pair: [Body, Body];
}
export interface CalcResultBonus extends CalcResultBase {
  type: "bonus";
  reds: number;
  dora: number;
  tanyao: boolean;
  chanta: boolean;
}
export interface CalcResultYakuman extends CalcResultBase {
  type: "yakuman";
  yakuman: "all-green" | "chinyao" | "super-red";
}
export type HandTiles = [Tile, Tile, Tile, Tile, Tile, Tile];
export default function calc(
  handTiles: HandTiles,
  dora?: Tile,
): CalcResult | undefined {
  const pair = makePair(handTiles);
  if (!pair) return;
  if (handTiles.every(isGreen)) {
    return { pair, type: "yakuman", yakuman: "all-green" };
  }
  if (handTiles.every(isYaochuuhai)) {
    return { pair, type: "yakuman", yakuman: "chinyao" };
  }
  if (handTiles.every(isRed)) {
    return { pair, type: "yakuman", yakuman: "super-red" };
  }
  return {
    pair,
    type: "bonus",
    reds: handTiles.filter(isRed).length,
    dora: dora
      ? handTiles.filter(
        (tile) => getNumber(tile) === getNumber(dora),
      ).length
      : 0,
    tanyao: handTiles.every((tile) => !isYaochuuhai(tile)),
    chanta: pair[0].some(isYaochuuhai) && pair[1].some(isYaochuuhai),
  };
}
export function sum(calcResult: CalcResult): number {
  const meldCount = calcResult.pair.filter(isMeld).length;
  const chowCount = calcResult.pair.filter(isChow).length;
  const pairBonus = (meldCount * 2) + chowCount;
  if (calcResult.type === "yakuman") {
    return pairBonus + {
      "all-green": 10,
      "chinyao": 15,
      "super-red": 20,
    }[calcResult.yakuman];
  }
  return pairBonus +
    calcResult.reds +
    calcResult.dora +
    Number(calcResult.tanyao) +
    (Number(calcResult.chanta) * 2);
}

export type Body = [Tile, Tile, Tile];
export type Pair = [Body, Body];
export function makePair(
  handTiles: HandTiles,
): Pair | undefined {
  const sortedTiles = sortTiles(handTiles);
  const groupedTiles = groupTiles(sortedTiles);
  const groupedTileArray = Object.values(groupedTiles);
  // case 1: meld-meld
  if (
    groupedTileArray.length === 2 &&
    groupedTileArray[0].length === 3 &&
    groupedTileArray[1].length === 3
  ) return groupedTileArray as Pair;
  // case 2: meld-chow (= chow-meld)
  const melded = groupedTileArray.filter(
    (group) => group.length >= 3,
  )?.[0]?.slice(0, 3) as Body;
  if (melded) {
    const other = sortedTiles.filter((tile) => !melded.includes(tile)) as Body;
    if (!isChow(other)) return;
    return [melded, other];
  }
  // case 3: chow-chow
  if ((-11 in groupedTiles) || (-10 in groupedTiles)) return; // "🀄", "🀅"
  const smallest = sortedTiles[0];
  const smallestNumber = getNumber(smallest);
  if (!((smallestNumber + 1) in groupedTiles)) return;
  if (!((smallestNumber + 2) in groupedTiles)) return;
  const chow = [
    smallest,
    groupedTiles[smallestNumber + 1].shift(),
    groupedTiles[smallestNumber + 2].shift(),
  ] as Body;
  const other = sortedTiles.filter((tile) => !chow.includes(tile)) as Body;
  if (!isChow(other)) return;
  return [chow, other];
}

export function isMeld(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return (a === b) && (b === c);
}

export function isChow(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return ((b - a) === 1) && ((c - b) === 1);
}
