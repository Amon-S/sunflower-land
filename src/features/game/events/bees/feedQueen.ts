import { GameState, Inventory, InventoryItemName } from "../../types/game";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { BeeItem, BEE_ITEMS } from "../../types/craftables";

export const getBeeTime = () => {
  const seconds = BEE_ITEMS["Queen"].workTime;
  return seconds;
};

export type FeedQueenAction = {
  type: "queen.feeded";
  worker: BeeItem;
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: FeedQueenAction;
  energy?: number;
};

type GetEnergyArgs = {
  index: number;
  inventory: Inventory;
};

export const getRequiredHoney = (inventory: Inventory) => {
  return new Decimal(5);
};

export function feedQueen({ state, action, energy }: Options) {
  const requiredHoney = getRequiredHoney(state.inventory);

  const cells = { ...state.queenChamber };

  const cell = cells[action.index];

  if (!cell) {
    throw new Error("No queen was deposited");
  }

  const inventoryHoney = state.inventory["Honey"] || new Decimal(0);
  if (inventoryHoney.lessThan(5)) {
    throw new Error("Not enough honey");
  }
  const bee = cell.worker;
  const cellEnergy = cell.energy;
  const cellMaxEnergy = cell.maxEnergy;

  if (cellEnergy === cellMaxEnergy) {
    throw new Error("Queen is full" + cellEnergy);
  }

  if (action.item == "Honey") {
    throw new Error("Select honey to feed Queen");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid feed");
  }

  const newCell = cells;
  newCell[action.index] = {
    worker: bee,
    energy: cellEnergy + 1,
    maxEnergy: 5,
  };

  const multiplier = 1;

  const inventory: Inventory = {
    ...state.inventory,
    Honey: inventoryHoney.sub(requiredHoney),
  };

  return {
    ...state,
    queenChamber: newCell,
    inventory,
  } as GameState;
}
