import { GameState, Inventory, InventoryItemName } from "../../types/game";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { BeeItem, BEE_ITEMS } from "../../types/craftables";

export const getBeeTime = () => {
  const seconds = BEE_ITEMS["Queen"].workTime;
  return seconds;
};

export type HarvestBeeAction = {
  type: "harvest.bees";
  worker: BeeItem;
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: HarvestBeeAction;
  worketAt?: number;
};

export function harvestBee({ state, action, worketAt = Date.now() }: Options) {
  const cells = { ...state.queenChamber };

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

  const bee = cell.worker;
  const taskStart = cell.taskStart!;

  if (worketAt - taskStart < (BEE_ITEMS[bee].workTime as number) * 1000) {
    throw new Error("Not ready");
  }

  if (!screenTracker.calculate()) {
    throw new Error("Invalid harvest");
  }

  if (cell.reward == "Drone") {
    throw new Error("Bees incubating");
  }

  const newCells = cells;
  newCells[action.index] = {
    worker: bee,
    maxEnergy: 5,
    energy: cell.energy,
    active: false,
    reward: "Bee",
  };

  const rewardCount = state.inventory.Bee || new Decimal(0);

  const multiplier = cell.multiplier || 12;

  const inventory: Inventory = {
    ...state.inventory,
    Bee: rewardCount.add(12),
  };

  return {
    ...state,
    queenChamber: newCells,
    inventory,
  } as GameState;
}
