import { computed, signal, useComputed, useSignal } from "@preact/signals";
import { useLayoutEffect } from "preact/hooks";
import { motion } from "framer-motion";
import calc from "shared/game/calc.ts";

export default function Calc() {
  const fixSizedHandTiles = fixSizedHandTilesSignal.value;
  const doraTile = doraTileSignal.value;
  return (
    <div class="flex flex-col gap-4 px-4 pb-8 mx-auto max-w-[30rem] md:max-w-[80rem]">
      <h1 class="font-bold">
        <span class="text-3xl">𓅪</span> 점수 계산기
      </h1>
      <div class="grid md:[grid-template-columns:10fr_7fr] gap-4">
        <div class="grid grid-cols-11 gap-1">
          {["a", "b", "c", "r"].map((line) => {
            return tiles.map((tile) => {
              const tileId = `${line}${tile}`;
              if (inHandOrDora(tileId)) return <Slot />;
              const onClick = () => addHandOrSetDora(tileId);
              return (
                <button key={tileId} onClick={onClick}>
                  <Slot tileId={tileId} />
                </button>
              );
            });
          }).flat()}
        </div>
        <div class="flex gap-4">
          <div class="basis-0 grow-[6.5] flex flex-col gap-1">
            <h2 class="text-xs text-[#666]">손패</h2>
            <div class="inline-flex gap-1">
              {fixSizedHandTiles.map((tileId, i) => {
                if (!tileId) return <Slot key={i} />;
                return (
                  <button
                    key={i}
                    class="flex-1"
                    onClick={() => removeHandTile(tileId)}
                  >
                    <Slot tileId={tileId} />
                  </button>
                );
              })}
            </div>
          </div>
          <div class="basis-0 grow-[1] flex flex-col gap-1">
            <h2 class="text-xs text-[#666]">도라</h2>
            {doraTile
              ? (
                <button onClick={() => setDoraTile(undefined)}>
                  <Slot tileId={doraTile} />
                </button>
              )
              : <Slot />}
          </div>
        </div>
      </div>
      <div class="absolute inset-0 select-none pointer-events-none">
        {["a", "b", "c", "r"].map((line) => {
          return tiles.map((tile) => {
            const tileId = `${line}${tile}`;
            return <Tile {...getTileProps(tileId)} />;
          });
        }).flat()}
      </div>
      <h2 class="text-xs font-bold">계산 결과</h2>
      <CalcResult />
    </div>
  );
}

function CalcResult() {
  const calcResult = calcResultSignal.value;
  if (!calcResult) return <div class="text-sm">몸통 두 개를 만들어주세요</div>;
  return (
    <div>
      <h3 class="pb-2 text-xs text-[#666]">몸통 두 개</h3>
      <div class="grid grid-cols-2 gap-4 w-[12rem]">
        {calcResult.pair.map((body) => {
          return (
            <div class="flex gap-1">
              {body.map((tileId) => <TileShape {...getTileProps(tileId)} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
  // TODO
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}
interface SlotRects {
  [tileId: string]: Rect;
}
const slotRectsSignal = signal<SlotRects>({});

const calcResultSignal = computed(() => {
  const handTiles = handTilesSignal.value;
  const doraTile = doraTileSignal.value;
  if (handTiles.length < 6) return;
  const result = calc(doraTile as any, handTiles as any);
  return result;
});

const handTilesSignal = signal<string[]>([]);
const doraTileSignal = signal<string | undefined>(undefined);
const fixSizedHandTilesSignal = computed(() => {
  const handTiles = handTilesSignal.value;
  return Array(6).fill(undefined).map((_, i) => handTiles[i]);
});

function inHandOrDora(tileId: string): boolean {
  const handTiles = handTilesSignal.value;
  const doraTile = doraTileSignal.value;
  return handTiles.includes(tileId) || (tileId === doraTile);
}

function addHandOrSetDora(tileId: string) {
  const handTiles = handTilesSignal.value;
  const doraTile = doraTileSignal.value;
  if (doraTile) return addHandTile(tileId);
  if (handTiles.length < 6) return addHandTile(tileId);
  setDoraTile(tileId);
}

function addHandTile(tileId: string) {
  const handTiles = handTilesSignal.value;
  const newTiles = [tileId, ...handTiles];
  if (newTiles.length > 6) newTiles.length = 6;
  handTilesSignal.value = newTiles;
}

function removeHandTile(tileId: string) {
  const handTiles = handTilesSignal.value;
  handTilesSignal.value = handTiles.filter((handTile) => handTile !== tileId);
}

function setDoraTile(tileId: string | undefined) {
  doraTileSignal.value = tileId;
}

function getTileProps(tileId: string): TileProps {
  const tile = tileId.slice(1) as Tile;
  const red = tileId[0] === "r";
  return { tileId, tile, red };
}

const tiles = ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘", "🀅", "🀄"] as const;
type Tile = (typeof tiles)[number];

interface TileProps extends TileShapeProps {
  tileId?: string;
}
const tileStyle = "absolute top-[35%] left-0 w-full h-[58%] object-contain";
const dragonTileStyle =
  "absolute top-[44%] left-0 w-full h-[42%] object-contain";
const redFilter = {
  filter:
    "brightness(0) saturate(100%) invert(36%) sepia(92%) saturate(2715%) hue-rotate(321deg) brightness(91%) contrast(88%)",
};
function Tile({ tileId, ...shapeProps }: TileProps) {
  const containerClass = tileId
    ? `absolute w-full [view-transition-name:${tileId}]`
    : "absolute w-full";
  const zIndexSignal = useSignal(0);
  const zIndex = zIndexSignal.value;
  const rectSignal = useComputed(() => {
    const slotRects = slotRectsSignal.value;
    return tileId ? slotRects[tileId] : undefined;
  });
  const rect = rectSignal.value;
  if (!rect) return null;
  return (
    <motion.div
      class={containerClass}
      style={{ zIndex }}
      initial={false}
      animate={rect}
      onAnimationStart={() => zIndexSignal.value = 1}
      onAnimationComplete={() => zIndexSignal.value = 0}
    >
      <TileShape {...shapeProps} />
    </motion.div>
  );
}
interface TileShapeProps {
  tile: Tile;
  red?: boolean;
}
function TileShape({ tile, red }: TileShapeProps) {
  const isDragonTile = (tile === "🀄") || (tile === "🀅");
  const tileClass = isDragonTile ? dragonTileStyle : tileStyle;
  return (
    <div class="relative">
      <img class="w-full" src="/tiles/🀆.svg" />
      <img
        class={tileClass}
        src={`/tiles/${tile}.svg`}
        style={(red && !isDragonTile) ? redFilter : undefined}
      />
    </div>
  );
}

interface SlotProps {
  tileId?: string;
}
function Slot({ tileId }: SlotProps) {
  useLayoutEffect(() => {
    if (!tileId) return;
    function set() {
      const slot = document.querySelector(`[data-tile-id=${tileId}]`);
      if (!slot) return;
      const { top, left, width, height } = slot.getBoundingClientRect();
      slotRectsSignal.value = {
        ...slotRectsSignal.value,
        [tileId!]: { top, left, width, height },
      };
    }
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [tileId]);
  return (
    <div class="flex-1">
      <div class="py-[85%] bg-[#f8f8f8] rounded" data-tile-id={tileId} />
    </div>
  );
}
