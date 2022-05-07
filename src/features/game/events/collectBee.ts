import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { Bee } from "../types/craftables";
const bees: Record<number, Bee> = {
  0: "Bee",
};

const HUNT_START_AT_MS = Date.UTC(2022, 3, 16, 12);

export function availableBee(now: number = Date.now()): Bee {
  // Get the current time
  const difference = now - HUNT_START_AT_MS;
  // 4 hour periods to collect a certain egg
  const periodsElapsed = Math.floor(difference / 1000 / 60);
  // Figure out how many periods of four hours have passed.
  const beeIndex = periodsElapsed % 1;

  return bees[beeIndex];
}

export type CollectBeeAction = {
  type: "bee.collected";
};

type Options = {
  state: GameState;
  action: CollectBeeAction;
  createdAt?: number;
};

export function collectBee({ state, action, createdAt = Date.now() }: Options) {
  if (!state.inventory["Net"]) {
    throw new Error("Missing a net to catch the insect");
  }

  const beeAmount = state.inventory.Bee || new Decimal(0);
  const netAmount = state.inventory.Net || new Decimal(0);
  return {
    ...state,
    inventory: {
      ...state.inventory,
      Bee: beeAmount.add(1),
      Net: netAmount.sub(1),
    },
  };
}
