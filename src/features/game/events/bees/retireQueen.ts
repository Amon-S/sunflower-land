import { screenTracker } from "lib/utils/screen";
import { GameState, InventoryItemName } from "../../types/game";

export type QueenRetireAction = {
  type: "queen.retired";
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
  action: QueenRetireAction;
};

export function retireQueen({ state, action }: Options) {
  const cells = { ...state.queenChamber };

  if (!Number.isInteger(action.index)) {
    throw new Error("Field does not exist");
  }

  if (!state.inventory["Queen"]) {
    throw new Error("Need a Queen first");
  }

  const cell = cells[action.index];

  if (cell.active) {
    throw new Error("Queen is currently working");
  }

  if (cell.energy > 0) {
    throw new Error("Need to use the energy left first");
  }

  if (!cell) {
    throw new Error("Cell is empty");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid bee");
  }

  const newCells = cells;
  delete newCells[action.index];

  return {
    ...state,
    inventory: {
      ...state.inventory,
    },
    queenChamber: newCells,
  } as GameState;
}
