import Decimal from "decimal.js-light";
import {
  Flower,
  FlowerName,
  GameState,
  Inventory,
  InventoryItemName,
} from "../../types/game";

export enum POLLINATE_ERRORS {
  MISSING_BEE = "No bee",
  NO_BEES = "No bees left",
  NO_FLOWER = "No flower",
  STILL_GROWING = "Flower is still growing",
}

const FlowerList: FlowerName[] = [
  "White Flower",
  "Red Flower",
  "Purple Flower",
  "Blue Flower",
  "Black Flower",
  "Gold Flower",
];

type rarity = {
  name: FlowerName;
  chance: number;
};

const rarities: rarity[] = [
  {
    name: "White Flower",
    chance: 59,
  },
  {
    name: "Red Flower",
    chance: 20,
  },
  {
    name: "Purple Flower",
    chance: 10,
  },
  {
    name: "Blue Flower",
    chance: 5,
  },
  {
    name: "Black Flower",
    chance: 3,
  },
  {
    name: "Gold Flower",
    chance: 2,
  },
];
const getRandomFlower = (): FlowerName => {
  // Calculate chances for common
  const filler =
    100 - rarities.map((r) => r.chance).reduce((sum, current) => sum + current);

  if (filler <= 0) {
    console.log("chances sum is higher than 100!");
    return "White Flower";
  }

  // Create an array of 100 elements, based on the chances field
  const probability = rarities
    .map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i))
    .reduce((c, v) => c.concat(v), []);

  // Pick one
  const pIndex = Math.floor(Math.random() * 100);
  const rarity = rarities[probability[pIndex]];
  const rarityName = rarity.name;

  return rarityName;
};

export const COOLDOWN_LIST = {
  "White Flower": 24,
  "Red Flower": 48,
  "Purple Flower": 72,
  "Blue Flower": 96,
  "Black Flower": 192,
  "Gold Flower": 384,
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
  switch (flowerName) {
    case "Red Flower":
      return new Decimal(2);
      break;
    case "Purple Flower":
      return new Decimal(4);
      break;
    case "Blue Flower":
      return new Decimal(8);
      break;
    case "Black Flower":
      return new Decimal(16);
      break;
    case "Gold Flower":
      return new Decimal(32);
  }
  return new Decimal(1);
}

export function getGivenPollen(flower: FlowerName) {
  switch (flower) {
    case "Red Flower":
      return new Decimal(5);
      break;
    case "Purple Flower":
      return new Decimal(10);
      break;
    case "Blue Flower":
      return new Decimal(20);
      break;
    case "Black Flower":
      return new Decimal(50);
      break;
    case "Gold Flower":
      return new Decimal(80);
  }
  return new Decimal(1);
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
  const newBeeName = getRandomFlower();
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
