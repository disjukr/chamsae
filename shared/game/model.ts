import { Type } from "npm:@sinclair/typebox";
import model from "../model.ts";
import { tiles } from "./mod.ts";

export const Tile = model(
  Type.Union(tiles.map((tile) => Type.Literal(tile))),
);
