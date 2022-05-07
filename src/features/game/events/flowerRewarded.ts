import Decimal from "decimal.js-light";

import { FLOWERS, GameState } from "../types/game";
import { COOLDOWN_LIST } from "./harvestPollen";

export type OpenFlowerRewardAction = {
  type: "flower.rewarded";
  flowerIndex: number;
};

type Options = {
  state: GameState;
  action: OpenFlowerRewardAction;
  createdAt?: number;
};

export function openFlowerReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const flower = state.flowers[action.flowerIndex];

  if (!flower) {
    throw new Error("flower does not exist");
  }

  if (!flower.reward) {
    throw new Error("flower does not have a reward");
  }

  const flowername = FLOWERS()[flower.name];

  if (createdAt - flower.pollinatedAt < COOLDOWN_LIST[flower.name] * 1000) {
    throw new Error("Not ready");
  }

  // Only a single seed reward supported at the moment
  const seed = flower.reward.items[0];

  const inventory = { ...state.inventory };

  const seedBalance = inventory[seed.name] || new Decimal(0);
  inventory[seed.name] = seedBalance.add(seed.amount);

  // Remove the reward
  delete state.fields[action.flowerIndex].reward;

  return {
    ...state,
    inventory,
  };
}
