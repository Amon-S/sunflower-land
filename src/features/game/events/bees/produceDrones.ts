import { screenTracker } from "lib/utils/screen";
import { BeeItem, BEE_ITEMS } from "../../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../../types/game";

export type DroneWorkerAction = {
  type: "droneBee.producing";
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: DroneWorkerAction;
  workedAt?: number;
};

type GetWorkedAtArgs = {
  bee: BeeItem;
  inventory: Inventory;
  workedAt: number;
};

/**
 * Based on boosts, how long the queen will take to make worker bees
 */
export const getBeeTime = (bee: BeeItem, inventory: Inventory) => {
  const seconds = BEE_ITEMS[bee].workTime as number;

  //boosts go here
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

export function produceDrones({
  state,
  action,
  workedAt = Date.now(),
}: Options) {
  const cells = { ...state.queenChamber };

  if (action.index < 0) {
    throw new Error("Field does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  const cell = cells[action.index];

  if (cell.active) {
    throw new Error("Cell is currently active");
  }

  if (cell.energy < 1) {
    throw new Error("Not enough energy");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid cell");
  }

  const newCells = cells;

  const bee = cell.worker;
  const currentEnergy = cell.energy;

  newCells[action.index] = {
    taskStart: getWorkedAt({ bee, inventory: state.inventory, workedAt }),
    energy: currentEnergy - 2,
    maxEnergy: 5,
    worker: bee,
    active: true,
    reward: "Drone",
  };

  return {
    ...state,
    inventory: {
      ...state.inventory,
    },
    queenChamber: newCells,
  } as GameState;
}
