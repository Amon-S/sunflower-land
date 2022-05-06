import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { BEES, HiveBee } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";

export type WorkAction = {
  type: "drone.working";
  item?: InventoryItemName;
  index: number;
};

// Bees which are implemented
const VALID_WORKERS: InventoryItemName[] = ["Drone"];

export function isBee(bee: InventoryItemName): bee is HiveBee {
  return VALID_WORKERS.includes(bee);
}

type Options = {
  state: GameState;
  action: WorkAction;
  workedAt?: number;
};

type GetWorkedAtArgs = {
  bee: HiveBee;
  inventory: Inventory;
  workedAt: number;
};

/**
 * Based on boosts, how long a cell will take to make honey
 */
export const getBeeTime = (bee: HiveBee, inventory: Inventory) => {
  let seconds = BEES[bee].workTime as number;

  return seconds;
};

/**
 * Set a workedAt in the past to make a cell produce faster
 */
function getWorkedAt({ bee, inventory, workedAt }: GetWorkedAtArgs): number {
  const beeTime = BEES[bee].workTime as number;
  const boostedTime = getBeeTime(bee, inventory);

  const offset = beeTime - boostedTime;

  return workedAt - offset * 1000;
}

type GetCellArgs = {
  bee: HiveBee;
  inventory: Inventory;
};

/**
 * Based on items, the output will be different
 */
function getMultiplier({ bee, inventory }: GetCellArgs): number {
  let multiplier = 1;

  return multiplier;
}

export function harvestHoney({
  state,
  action,
  workedAt = Date.now(),
}: Options) {
  const cells = { ...state.hiveCells };

  if (action.index < 0) {
    throw new Error("Field does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (action.index > 3 && action.index < 6 && !state.inventory["Bee Box"]) {
    throw new Error("Need to upgrade hive");
  }

  const cell = cells[action.index];
  if (cell) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No seed selected");
  }

  if (!isBee(action.item)) {
    throw new Error("Not a seed");
  }

  const beeCount = state.inventory[action.item] || new Decimal(0);
  const pollenCount = state.inventory.Pollen || new Decimal(0);

  if (beeCount.lessThan(1)) {
    throw new Error("Not enough drones ");
  }

  if (pollenCount.lessThan(5)) {
    throw new Error("Not enough pollen");
  }
  if (!screenTracker.calculate()) {
    throw new Error("Invalid plant");
  }

  const newCells = cells;

  const bee = action.item.split(" ")[0] as HiveBee;

  newCells[action.index] = {
    taskStart: getWorkedAt({ bee, inventory: state.inventory, workedAt }),
    worker: bee,
    multiplier: getMultiplier({ bee, inventory: state.inventory }),
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
      [action.item]: beeCount.sub(1),
      Pollen: pollenCount.sub(5),
    },
    hiveCells: newCells,
  } as GameState;
}
