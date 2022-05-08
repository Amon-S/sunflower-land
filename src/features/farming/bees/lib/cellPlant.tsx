import workingBee from "assets/animals/bees/workingDrone.gif";
import honey from "assets/resources/honey.png";
import queenFlexin from "assets/animals/bees/queen2.gif";

export type Lifecycle = {
  initial: any;
  almost: any;
  ready: any;
};

type cellBee = "Drone" | "Queen";

/**
 * Crops and their original prices
 * TODO - use crop name from GraphQL API
 */
export const CELL_LIFECYCLE: Record<cellBee, Lifecycle> = {
  Drone: {
    initial: workingBee,
    almost: workingBee,
    ready: honey,
  },
  Queen: {
    initial: queenFlexin,
    almost: queenFlexin,
    ready: honey,
  },
};
