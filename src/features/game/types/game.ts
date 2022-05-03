import { Decimal } from "decimal.js-light";
import { GameEvent } from "../events";

import { CropName, SeedName } from "./crops";
import { CraftableName, BeeItem } from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";

export type Reward = {
  items: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: Reward;
};

export type Tree = {
  wood: Decimal;
  // Epoch time in milliseconds
  choppedAt: number;
};

export type Rock = {
  amount: Decimal;
  // Epoch time in milliseconds
  minedAt: number;
};

export type EasterEgg =
  | "Red Egg"
  | "Orange Egg"
  | "Green Egg"
  | "Blue Egg"
  | "Pink Egg"
  | "Purple Egg"
  | "Yellow Egg";

export const EASTER_EGGS: EasterEgg[] = [
  "Blue Egg",
  "Green Egg",
  "Orange Egg",
  "Pink Egg",
  "Purple Egg",
  "Red Egg",
  "Yellow Egg",
];

export type EasterBunny = "Easter Bunny";

export type FlowerName = "White Flower" | "Red Flower";

export type Flower = {
  name: FlowerName;
  honey: Decimal;
  //Epoch time in milliseconds
  pollinatedAt: number;
  cooldown: number;
  reward?: Reward;
};

export const FLOWERS: () => Record<FlowerName, Flower> = () => ({
  "White Flower": {
    name: "White Flower",
    pollinatedAt: 0,
    honey: new Decimal(4),
    cooldown: 60 * 60,
  },
  "Red Flower": {
    name: "Red Flower",
    pollinatedAt: 0,
    honey: new Decimal(8),
    cooldown: 48 * 60 * 60,
  },
});

export type InventoryItemName =
  | CropName
  | SeedName
  | CraftableName
  | ResourceName
  | SkillName
  | EasterEgg
  | EasterBunny
  | BeeItem
  | FlowerName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type GameState = {
  id?: number;
  balance: Decimal;
  fields: Record<number, FieldItem>;

  trees: Record<number, Tree>;
  stones: Record<number, Rock>;
  iron: Record<number, Rock>;
  gold: Record<number, Rock>;
  flowers: Record<number, Flower>;
  inventory: Inventory;
  stock: Inventory;

  farmAddress?: string;

  skills: {
    farming: Decimal;
    gathering: Decimal;
  };
};

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
