import { GameState, Inventory, InventoryItemName } from "../../types/game";
import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import { BeeItem, BEE_ITEMS } from "../../types/craftables";

export const getBeeTime = () => {
  const seconds = BEE_ITEMS["Queen"].workTime;
  return seconds;
};

export type HarvestDroneAction = {
  type: "harvest.drones";
  worker: BeeItem;
  item?: InventoryItemName;
  index: number;
};

type Options = {
  state: GameState;
  action: HarvestDroneAction;
  worketAt?: number;
};

export function harvestDrones({
  state,
  action,
  worketAt = Date.now(),
}: Options) {
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

  const newCells = cells;
  newCells[action.index] = {
    worker: bee,
    maxEnergy: 5,
    energy: cell.energy,
    active: false,
    reward: "Drone",
  };

  if (cell.reward == "Bee") {
    throw new Error("Drones incubating");
  }

  const rewardCount = state.inventory.Drone || new Decimal(0);

  const multiplier = cell.multiplier || 3;

  const inventory: Inventory = {
    ...state.inventory,
    Drone: rewardCount.add(multiplier),
  };

  return {
    ...state,
    queenChamber: newCells,
    inventory,
  } as GameState;
}
