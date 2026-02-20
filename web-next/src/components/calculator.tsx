"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  calc,
  type Body,
  type HandTiles,
  isChow,
  isMeld,
  sum,
  sortTiles,
  type Tile,
} from "@chamsae/core/game";

const tileFaces = [
  "🀐",
  "🀑",
  "🀒",
  "🀓",
  "🀔",
  "🀕",
  "🀖",
  "🀗",
  "🀘",
  "🀅",
  "🀄",
] as const;

const tileIds = ["a", "b", "c", "r"].flatMap((line) =>
  tileFaces.map((face) => `${line}${face}` as Tile)
);

const resultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.2,
    },
  },
};

const resultItemVariants = {
  hidden: { opacity: 0, x: "2rem" },
  visible: { opacity: 1, x: 0 },
};

function toHandTiles(tiles: Tile[]): HandTiles | undefined {
  if (tiles.length !== 6) {
    return undefined;
  }
  return [tiles[0], tiles[1], tiles[2], tiles[3], tiles[4], tiles[5]];
}

function tileShape(tileId: Tile): { tile: string; red: boolean } {
  return { tile: tileId.slice(1), red: tileId[0] === "r" };
}

function TileView({ tileId }: { tileId: Tile }) {
  const { tile, red } = tileShape(tileId);
  const isDragon = tile === "🀄" || tile === "🀅";
  const classNames = ["tile-face", isDragon ? "dragon" : "", red && !isDragon ? "red" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="slot">
      <div className="tile-shape">
        <img className="tile-base" src="/tiles/🀆.svg" alt="" />
        <img className={classNames} src={`/tiles/${tile}.svg`} alt={tile} />
      </div>
    </div>
  );
}

function EmptyTile() {
  return <div className="slot" />;
}

function PairBody({ body }: { body: Body }) {
  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {body.map((tile) => (
        <div key={tile} style={{ width: "2.2rem" }}>
          <TileView tileId={tile} />
        </div>
      ))}
    </div>
  );
}

export default function Calculator() {
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [doraTile, setDoraTile] = useState<Tile | undefined>(undefined);

  const fixedHand = useMemo(
    () => Array.from({ length: 6 }, (_, i) => handTiles[i]),
    [handTiles],
  );

  const result = useMemo(() => {
    const hand = toHandTiles(handTiles);
    if (!hand) {
      return undefined;
    }
    return calc(hand, doraTile);
  }, [handTiles, doraTile]);

  const inHandOrDora = (tileId: Tile) => {
    return handTiles.includes(tileId) || doraTile === tileId;
  };

  const addHandOrSetDora = (tileId: Tile) => {
    if (!doraTile) {
      setDoraTile(tileId);
      return;
    }
    setHandTiles((prev) => {
      const next = [...prev, tileId];
      while (next.length > 6) {
        next.shift();
      }
      return next;
    });
  };

  const removeHandTile = (tileId: Tile) => {
    setHandTiles((prev) => prev.filter((value) => value !== tileId));
  };

  return (
    <main className="container">
      <h1 className="title">
        <Image src="/tiles/🀐.svg" alt="타일" width={24} height={24} unoptimized />
        <span>점수 계산기</span>
      </h1>

      <div className="grid">
        <div className="tiles-grid">
          {tileIds.map((tileId) => {
            if (inHandOrDora(tileId)) {
              return <EmptyTile key={tileId} />;
            }
            return (
              <button
                key={tileId}
                type="button"
                className="tile-button"
                onClick={() => addHandOrSetDora(tileId)}
              >
                <TileView tileId={tileId} />
              </button>
            );
          })}
        </div>

        <div className="panel">
          <div className="dora-column">
            <p className="meta">도라</p>
            {doraTile ? (
              <button
                type="button"
                className="tile-button"
                onClick={() => setDoraTile(undefined)}
              >
                <TileView tileId={doraTile} />
              </button>
            ) : (
              <EmptyTile />
            )}
          </div>

          <div className="hand-column">
            <p className="meta">
              손패
              <button
                type="button"
                className="btn-sort"
                onClick={() => setHandTiles((prev) => sortTiles(prev))}
              >
                정렬하기
              </button>
            </p>
            <div className="hand">
              {fixedHand.map((tileId, i) => {
                if (!tileId) {
                  return (
                    <div key={i} style={{ flex: 1 }}>
                      <EmptyTile />
                    </div>
                  );
                }
                return (
                  <button
                    key={`${tileId}-${i}`}
                    type="button"
                    className="tile-button"
                    style={{ flex: 1 }}
                    onClick={() => removeHandTile(tileId)}
                  >
                    <TileView tileId={tileId} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">점수 계산</h2>

      {!result ? (
        <p>몸통 두 개를 만들어주세요</p>
      ) : (
        <motion.div
          className="result-box"
          variants={resultContainerVariants}
          initial="hidden"
          animate="visible"
          key={`${result.type}-${result.pair.flat().join("-")}`}
        >
          <motion.div variants={resultItemVariants}>
            <p className="meta">
              {(() => {
                const meldCount = result.pair.filter(isMeld).length;
                const chowCount = result.pair.filter(isChow).length;
                if (meldCount && chowCount) {
                  return "같은패 몸통 하나 (2점), 순서대로 몸통 하나 (1점)";
                }
                if (meldCount) {
                  return "같은패 몸통 둘 (4점)";
                }
                return "순서대로 몸통 둘 (2점)";
              })()}
            </p>
            <div className="result-pairs">
              {result.pair.map((body, idx) => (
                <PairBody key={idx} body={body} />
              ))}
            </div>
          </motion.div>

          {result.type === "yakuman" ? (
            <motion.p variants={resultItemVariants}>
              {{
                "all-green": "올 그린 (10점)",
                chinyao: "칭야오 (15점)",
                "super-red": "슈퍼 레드 (20점)",
              }[result.yakuman]}
            </motion.p>
          ) : (
            <motion.p variants={resultItemVariants}>
              {[
                result.reds ? `적색패 ${result.reds}개 (${result.reds}점)` : "",
                result.dora ? `도라 ${result.dora}개 (${result.dora}점)` : "",
                result.tanyao ? "탕야오 (1점)" : "",
                result.chanta ? "찬타 (2점)" : "",
              ].filter(Boolean).join(", ") || "보너스 없음"}
            </motion.p>
          )}

          <motion.div variants={resultItemVariants}>
            <p className="section-title" style={{ marginTop: 0 }}>총점</p>
            <p className="score">
              {sum(result)}점 {sum(result) >= 5 ? "(화료가능)" : ""}
            </p>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
