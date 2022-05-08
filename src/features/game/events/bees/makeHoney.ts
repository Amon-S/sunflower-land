import { GameState, Inventory } from "../../types/game";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { BEES } from "../../types/craftables";

export type HoneyAction = {
  type: "honey.harvested";
  index: number;
};

type Options = {
  state: GameState;
  action: HoneyAction;
  worketAt?: number;
};

export function makeHoney({ state, action, worketAt = Date.now() }: Options) {
  const cells = { ...state.hiveCells };

  if (action.index < 0) {
    throw new Error("Cell does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Cell does not exist");
  }

  const cell = cells[action.index];
  if (!cell) {
    throw new Error("No pollen was transformed");
  }

  const bee = BEES[cell.worker];

  if (worketAt - cell.taskStart < (bee.workTime as number) * 1000) {
    throw new Error("Not ready");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid harvest");
  }

  const newCells = cells;
  delete newCells[action.index];

  const beeCount = state.inventory[cell.worker] || new Decimal(0);
  const honeyCount = state.inventory.Honey || new Decimal(0);
  const multiplier = cell.multiplier || 1;

  const inventory: Inventory = {
    ...state.inventory,
    Honey: honeyCount.add(multiplier),
  };

  return {
    ...state,
    hiveCells: newCells,
    inventory,
  } as GameState;
}
