import {
  getNumber,
  groupTiles,
  isGreen,
  isRed,
  isYaochuuhai,
  sortTiles,
  type Tile,
} from "./mod";

export type Body = [Tile, Tile, Tile];
export type Pair = [Body, Body];
export type HandTiles = [Tile, Tile, Tile, Tile, Tile, Tile];

export type CalcResult = CalcResultBonus | CalcResultYakuman;

interface CalcResultBase {
  pair: Pair;
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

export default function calc(
  handTiles: HandTiles,
  dora?: Tile,
): CalcResult | undefined {
  const pair = makePair(handTiles);
  if (!pair) {
    return undefined;
  }

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
      ? handTiles.filter((tile) => getNumber(tile) === getNumber(dora)).length
      : 0,
    tanyao: handTiles.every((tile) => !isYaochuuhai(tile)),
    chanta: pair[0].some(isYaochuuhai) && pair[1].some(isYaochuuhai),
  };
}

export function sum(calcResult: CalcResult): number {
  const meldCount = calcResult.pair.filter(isMeld).length;
  const chowCount = calcResult.pair.filter(isChow).length;
  const pairBonus = meldCount * 2 + chowCount;

  if (calcResult.type === "yakuman") {
    const yakumanBonus = {
      "all-green": 10,
      chinyao: 15,
      "super-red": 20,
    }[calcResult.yakuman];
    return pairBonus + yakumanBonus;
  }

  return pairBonus +
    calcResult.reds +
    calcResult.dora +
    Number(calcResult.tanyao) +
    Number(calcResult.chanta) * 2;
}

function toBody(group: readonly Tile[]): Body | undefined {
  if (group.length !== 3) {
    return undefined;
  }
  return [group[0], group[1], group[2]];
}

export function makePair(handTiles: HandTiles): Pair | undefined {
  const sortedTiles = sortTiles(handTiles);
  const groupedTiles = groupTiles(sortedTiles);
  const groupedTileArray = Object.values(groupedTiles);

  if (
    groupedTileArray.length === 2 &&
    groupedTileArray[0].length === 3 &&
    groupedTileArray[1].length === 3
  ) {
    const first = toBody(groupedTileArray[0]);
    const second = toBody(groupedTileArray[1]);
    if (first && second) {
      return [first, second];
    }
  }

  const meldGroup = groupedTileArray.find((group) => group.length >= 3);
  const melded = meldGroup ? toBody(meldGroup.slice(0, 3)) : undefined;
  if (melded) {
    const otherCandidate = sortedTiles.filter((tile) => !melded.includes(tile));
    const other = toBody(otherCandidate);
    if (!other || !isChow(other)) {
      return undefined;
    }
    return [melded, other];
  }

  if (groupedTiles[-11] || groupedTiles[-10]) {
    return undefined;
  }

  const smallest = sortedTiles[0];
  const smallestNumber = getNumber(smallest);
  const group1 = groupedTiles[smallestNumber + 1];
  const group2 = groupedTiles[smallestNumber + 2];
  if (!group1 || !group2) {
    return undefined;
  }

  const tile2 = group1.shift();
  const tile3 = group2.shift();
  if (!tile2 || !tile3) {
    return undefined;
  }

  const chow: Body = [smallest, tile2, tile3];
  const otherCandidate = sortedTiles.filter((tile) => !chow.includes(tile));
  const other = toBody(otherCandidate);
  if (!other || !isChow(other)) {
    return undefined;
  }

  return [chow, other];
}

export function isMeld(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return a === b && b === c;
}

export function isChow(body: Body): boolean {
  const [a, b, c] = sortTiles(body).map(getNumber);
  return b - a === 1 && c - b === 1;
}
