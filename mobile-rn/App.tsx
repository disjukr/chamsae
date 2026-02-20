import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  calc,
  isChow,
  isMeld,
  sortTiles,
  sum,
  type HandTiles,
  type Tile,
} from "@chamsae/core/game";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  tileFaces.map((face) => `${line}${face}` as Tile),
);

function toHandTiles(tiles: Tile[]): HandTiles | undefined {
  if (tiles.length !== 6) {
    return undefined;
  }

  return [tiles[0], tiles[1], tiles[2], tiles[3], tiles[4], tiles[5]];
}

function tileLabel(tile: Tile): string {
  return tile.slice(1);
}

export default function App() {
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [doraTile, setDoraTile] = useState<Tile | undefined>(undefined);

  const fixedHand = useMemo(
    () => Array.from({ length: 6 }, (_, index) => handTiles[index]),
    [handTiles],
  );

  const result = useMemo(() => {
    const hand = toHandTiles(handTiles);
    if (!hand) {
      return undefined;
    }
    return calc(hand, doraTile);
  }, [doraTile, handTiles]);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>참새작 점수 계산기 (React Native)</Text>

        <Text style={styles.sectionTitle}>도라</Text>
        <View style={styles.singleRow}>
          {doraTile ? (
            <Pressable style={styles.selectedTile} onPress={() => setDoraTile(undefined)}>
              <Text style={styles.tileText}>{tileLabel(doraTile)}</Text>
            </Pressable>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.metaText}>선택하세요</Text>
            </View>
          )}
        </View>

        <View style={styles.handHeader}>
          <Text style={styles.sectionTitle}>손패</Text>
          <Pressable
            style={styles.sortButton}
            onPress={() => setHandTiles((prev) => sortTiles(prev))}
          >
            <Text style={styles.sortText}>정렬하기</Text>
          </Pressable>
        </View>
        <View style={styles.singleRow}>
          {fixedHand.map((tileId, index) => {
            if (!tileId) {
              return (
                <View key={index} style={styles.emptySlot}>
                  <Text style={styles.metaText}>빈칸</Text>
                </View>
              );
            }
            return (
              <Pressable
                key={`${tileId}-${index}`}
                style={styles.selectedTile}
                onPress={() => removeHandTile(tileId)}
              >
                <Text style={styles.tileText}>{tileLabel(tileId)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>타일 선택</Text>
        <View style={styles.tileGrid}>
          {tileIds.map((tileId) => (
            <Pressable
              key={tileId}
              style={inHandOrDora(tileId) ? styles.tileDisabled : styles.tileButton}
              onPress={() => addHandOrSetDora(tileId)}
              disabled={inHandOrDora(tileId)}
            >
              <Text style={styles.tileText}>{tileLabel(tileId)}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>계산 결과</Text>
        {!result ? (
          <Text style={styles.metaText}>몸통 두 개를 만들어주세요</Text>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.metaText}>
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
            </Text>

            <Text style={styles.metaText}>
              {result.type === "yakuman"
                ? {
                    "all-green": "올 그린 (10점)",
                    chinyao: "칭야오 (15점)",
                    "super-red": "슈퍼 레드 (20점)",
                  }[result.yakuman]
                : [
                    result.reds ? `적색패 ${result.reds}개 (${result.reds}점)` : "",
                    result.dora ? `도라 ${result.dora}개 (${result.dora}점)` : "",
                    result.tanyao ? "탕야오 (1점)" : "",
                    result.chanta ? "찬타 (2점)" : "",
                  ]
                    .filter(Boolean)
                    .join(", ") || "보너스 없음"}
            </Text>

            <Text style={styles.scoreText}>
              총점 {sum(result)}점 {sum(result) >= 5 ? "(화료가능)" : ""}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fbf7ef",
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2a241d",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#403627",
  },
  handHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8c7ae",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff8ec",
  },
  sortText: {
    color: "#5c4f3c",
    fontWeight: "600",
  },
  singleRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tileButton: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddceb6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffef9",
  },
  tileDisabled: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ede1cd",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0e8db",
    opacity: 0.55,
  },
  selectedTile: {
    width: 52,
    height: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cfb996",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7e8",
  },
  emptySlot: {
    width: 52,
    height: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ece1cf",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6efe2",
  },
  tileText: {
    fontSize: 30,
    lineHeight: 34,
  },
  metaText: {
    color: "#675845",
    fontSize: 14,
  },
  resultBox: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#f7eddc",
    borderWidth: 1,
    borderColor: "#e1d0b4",
    gap: 8,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#251d15",
  },
});
