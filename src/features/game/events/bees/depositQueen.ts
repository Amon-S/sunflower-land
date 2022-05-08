import { screenTracker } from "lib/utils/screen";
import { BeeItem, BEE_ITEMS } from "../../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../../types/game";

export type QueenDepositAction = {
  type: "queen.deposited";
  item?: InventoryItemName;
  index: number;
};

// Bees which are implemented
const VALID_WORKERS: InventoryItemName[] = ["Queen"];

export function isBee(bee: InventoryItemName) {
  return VALID_WORKERS.includes(bee);
}

type Options = {
  state: GameState;
  action: QueenDepositAction;
  workedAt?: number;
};

type GetWorkedAtArgs = {
  bee: BeeItem;
  inventory: Inventory;
  workedAt: number;
};

/**
 * Based on boosts, how long a cell will take to make honey
 */
export const getBeeTime = (bee: BeeItem, inventory: Inventory) => {
  const seconds = BEE_ITEMS[bee].workTime as number;

  return seconds;
};

/**
 * Set a workedAt in the past to make a cell produce faster
 */
function getWorkedAt({ bee, inventory, workedAt }: GetWorkedAtArgs): number {
  const beeTime = BEE_ITEMS[bee].workTime as number;
  const boostedTime = getBeeTime(bee, inventory);

  const offset = beeTime - boostedTime;

  return workedAt - offset * 1000;
}

type GetCellArgs = {
  bee: BeeItem;
  inventory: Inventory;
};

/**
 * Based on items, the output will be different
 */
function getMultiplier({ bee, inventory }: GetCellArgs): number {
  const multiplier = 1;

  return multiplier;
}

export function incubation({ state, action, workedAt = Date.now() }: Options) {
  const cells = { ...state.queenChamber };

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (!state.inventory["Queen"]) {
    throw new Error("Need a Queen first");
  }

  const cell = cells[action.index];
  if (cell) {
    throw new Error("Crop is already planted");
  }

  if (!action.item) {
    throw new Error("No queen selected");
  }

  if (!isBee(action.item)) {
    throw new Error("Not a queen");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid bee");
  }

  const newCells = cells;

  const bee = action.item.split(" ")[0] as BeeItem;

  newCells[action.index] = {
    taskStart: 0,
    worker: bee,
    energy: 0,
    maxEnergy: 5,
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
    },
    queenChamber: newCells,
  } as GameState;
}
