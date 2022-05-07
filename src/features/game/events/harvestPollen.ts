import Decimal from "decimal.js-light";
import {
  Flower,
  FlowerName,
  GameState,
  Inventory,
  InventoryItemName,
} from "../types/game";

export enum POLLINATE_ERRORS {
  MISSING_BEE = "No bee",
  NO_BEES = "No bees left",
  NO_FLOWER = "No flower",
  STILL_GROWING = "Flower is still growing",
}

const FlowerList: FlowerName[] = ["White Flower", "Red Flower"];

const getRandomBeeName = (): FlowerName => {
  const randomNum = Math.floor(Math.random() * FlowerList.length);
  return FlowerList[randomNum];
};

export const COOLDOWN_LIST = {
  "White Flower": 10,
  "Red Flower": 30 * 60,
};

export function canPollinate(flower: Flower, now: number = Date.now()) {
  return now - flower.pollinatedAt > COOLDOWN_LIST[flower.name] * 1000;
}

type GetPollinatedAtAtgs = {
  inventory: Inventory;
  pollinatedAt: number;
};

/**
 * Set a pollinatedAt in the past to make it replenish faster
 */
function getPollinatedAt({ pollinatedAt }: GetPollinatedAtAtgs): number {
  return pollinatedAt;
}

/**
 * Returns the amount of bees required to pollinate a  certain type of flower
 */
export function getRequiredBeeAmount(
  inventory: Inventory,
  flowerName: FlowerName
) {
  if (flowerName == "Red Flower") {
    return new Decimal(2);
  }

  return new Decimal(1);
}

export function getGivenPollen(flower: FlowerName) {
  if (flower == "Red Flower") {
    return new Decimal(5);
  } else if (flower == "White Flower") {
    return new Decimal(1);
  }
}

export type PollenAction = {
  type: "flower.pollinated";
  name: FlowerName;
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: GameState;
  action: PollenAction;
  pollinatedAt?: number;
};

export function Pollinate({
  state,
  action,
  pollinatedAt = Date.now(),
}: Options): GameState {
  const requiredBees = getRequiredBeeAmount(state.inventory, action.name);
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

  if (flower.name == "Red Flower" && beeAmount.lessThan(2)) {
    throw new Error(`Not enough bees for ${flower.name}`);
  }

  if (!canPollinate(flower, pollinatedAt)) {
    throw new Error(POLLINATE_ERRORS.STILL_GROWING);
  }

  const pollenAmount = state.inventory.Pollen || new Decimal(0);
  const newBeeName = getRandomBeeName();
  const addedAmount = getGivenPollen(flower.name) as Decimal;
  const honeyAmount = state.inventory.Honey || new Decimal(0);

  function randomNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function extraDrop(flower: FlowerName) {
    const rand = randomNum(5, 1);

    if (flower == "Red Flower" && rand === 3) {
      return new Decimal(1);
    } else {
      return new Decimal(0);
    }
  }

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Bee: beeAmount.sub(requiredBees),
      Pollen: pollenAmount.add(addedAmount),
      Honey: honeyAmount.add(extraDrop(flower.name)),
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
        cooldown: COOLDOWN_LIST[action.name],
      },
    },
  };
}
