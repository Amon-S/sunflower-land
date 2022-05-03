import { Action } from "components/ui/Action";
import Decimal from "decimal.js-light";
import {
  Flower,
  FlowerName,
  GameState,
  Inventory,
  InventoryItemName,
  FLOWERS,
} from "../types/game";

export enum POLLINATE_ERRORS {
  MISSING_BEE = "No bee",
  NO_BEES = "No bees left",
  NO_FLOWER = "No flower",
  STILL_GROWING = "Flower is still growing",
}

const FlowerList: FlowerName[] = ["White Flower", "Red Flower"];

const getRandomBeeName = (): FlowerName => {
  let randomNum = Math.floor(Math.random() * FlowerList.length);
  return FlowerList[randomNum];
};

export function canPollinate(flower: Flower, now: number = Date.now()) {
  return now - flower.pollinatedAt > FLOWERS()[flower.name].cooldown;
}

type GetPollinatedAtAtgs = {
  inventory: Inventory;
  pollinatedAt: number;
};

/**
 * Set a chopped in the past to make it replenish faster
 */
function getPollinatedAt({
  inventory,
  pollinatedAt,
}: GetPollinatedAtAtgs): number {
  return pollinatedAt;
}

/**
 * Returns the amount of bee required to pollinate a flower
 */
export function getRequiredBeeAmount(inventory: Inventory) {
  return new Decimal(1);
}

export type HoneyAction = {
  type: "flower.pollinated";
  name: FlowerName;
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: GameState;
  action: HoneyAction;
  pollinatedAt?: number;
};

export function Pollinate({
  state,
  action,
  pollinatedAt = Date.now(),
}: Options): GameState {
  const requiredBees = getRequiredBeeAmount(state.inventory);
  if (action.item !== "Bee" && requiredBees.gt(0)) {
    throw new Error(POLLINATE_ERRORS.MISSING_BEE);
  }

  const beeAmount = state.inventory.Bee || new Decimal(0);
  if (beeAmount.lessThan(requiredBees)) {
    throw new Error(POLLINATE_ERRORS.NO_BEES);
  }

  const flower = state.flowers[action.index];

  if (!flower) {
    throw new Error(POLLINATE_ERRORS.NO_FLOWER);
  }

  if (!canPollinate(flower, pollinatedAt)) {
    throw new Error(POLLINATE_ERRORS.STILL_GROWING);
  }

  const honeyAmount = state.inventory.Honey || new Decimal(0);
  const newBeeName = getRandomBeeName();

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Bee: beeAmount.sub(requiredBees),
      Honey: honeyAmount.add(flower.honey),
    },
    flowers: {
      ...state.flowers,
      [action.index]: {
        name: newBeeName,
        pollinatedAt: getPollinatedAt({
          pollinatedAt,
          inventory: state.inventory,
        }),
        // Placeholder, random numbers generated on server side
        honey: new Decimal(3),
        cooldown: FLOWERS()[newBeeName].cooldown,
      },
    },
  };
}
