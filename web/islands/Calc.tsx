export default function Calc() {
  return (
    <div class="p-4 flex gap-1">
      <Tile tile="🀐" />
      <Tile tile="🀑" />
      <Tile tile="🀒" />
      <Tile tile="🀓" />
      <Tile tile="🀔" />
      <Tile tile="🀕" />
      <Tile tile="🀖" />
      <Tile tile="🀗" />
      <Tile tile="🀘" />
      <Tile tile="🀅" />
      <Tile tile="🀄" />
    </div>
  );
}

interface TileProps {
  tile: "🀄" | "🀅" | "🀐" | "🀑" | "🀒" | "🀓" | "🀔" | "🀕" | "🀖" | "🀗" | "🀘";
  red?: boolean;
}
const tileStyle = "absolute top-[35%] left-0 w-full h-[58%] object-contain";
const dragonTileStyle =
  "absolute top-[44%] left-0 w-full h-[42%] object-contain";
function Tile({ tile }: TileProps) {
  const tileClass = ((tile === "🀄") || (tile === "🀅"))
    ? dragonTileStyle
    : tileStyle;
  return (
    <div class="relative w-max">
      <img src="/tiles/🀆.svg" />
      <img class={tileClass} src={`/tiles/${tile}.svg`} />
    </div>
  );
}
