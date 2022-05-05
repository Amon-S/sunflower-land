import emptyCell from "assets/icons/hiveCell.png";
import workingBee from "assets/animals/bees/workingDrone.gif";
import honey from "assets/resources/honey.png";

import potatoSeedling from "assets/crops/potato/seedling.png";
import potatoAlmostDone from "assets/crops/potato/almost.png";
import potatoPlant from "assets/crops/potato/plant.png";

import { HiveBee } from "features/game/types/craftables";

export type Lifecycle = {
  seedling: any;
  almost: any;
  ready: any;
};

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const CELL_LIFECYCLE: Record<HiveBee, Lifecycle> = {
  Drone: {
    seedling: workingBee,
    almost: workingBee,
    ready: honey,
  },
};
