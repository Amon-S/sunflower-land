import { craft, CraftAction } from "./craft";
import { sell, SellAction } from "./sell";
import { plant, PlantAction } from "./plant";
import { harvest, HarvestAction } from "./harvest";
import { mineGold, GoldMineAction } from "./goldMine";
import { mineStone, StoneMineAction } from "./stoneMine";
import { mineIron, IronMineAction } from "./ironMine";
import { chop, ChopAction } from "./chop";
import { openReward, OpenRewardAction } from "./rewarded";
import { PollenAction, Pollinate } from "./bees/harvestPollen";
import { collectBee, CollectBeeAction } from "./bees/collectBee";
import {
  openFlowerReward,
  OpenFlowerRewardAction,
} from "./bees/flowerRewarded";
import { harvestHoney, WorkAction } from "./bees/sendDrone";
import { HoneyAction, makeHoney } from "./bees/makeHoney";
import { GameState } from "../types/game";
import { incubation, QueenDepositAction } from "./bees/depositQueen";
import { feedQueen, FeedQueenAction } from "./bees/feedQueen";
import { QueenRetireAction, retireQueen } from "./bees/retireQueen";

export type GameEvent =
  | CraftAction
  | SellAction
  | PlantAction
  | HarvestAction
  | StoneMineAction
  | IronMineAction
  | GoldMineAction
  | ChopAction
  | OpenRewardAction
  | PollenAction
  | CollectBeeAction
  | OpenFlowerRewardAction
  | WorkAction
  | HoneyAction
  | QueenDepositAction
  | FeedQueenAction
  | QueenRetireAction;

type EventName = Extract<GameEvent, { type: string }>["type"];

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers = {
  [Name in EventName]: (options: {
    state: GameState;
    // Extract the correct event payload from the list of events
    action: Extract<GameEvent, { type: Name }>;
  }) => GameState;
};

export const EVENTS: Handlers = {
  "item.planted": plant,
  "item.harvested": harvest,
  "item.crafted": craft,
  "item.sell": sell,
  "stone.mined": mineStone,
  "iron.mined": mineIron,
  "gold.mined": mineGold,
  "tree.chopped": chop,
  "reward.opened": openReward,
  "flower.pollinated": Pollinate,
  "bee.collected": collectBee,
  "flower.rewarded": openFlowerReward,
  "drone.working": harvestHoney,
  "honey.harvested": makeHoney,
  "queen.deposited": incubation,
  "queen.feeded": feedQueen,
  "queen.retired": retireQueen,
};
