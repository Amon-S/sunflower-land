export type ResourceName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Egg"
  | "Chicken"
  | "Bee"
  | "Drone"
  | "Queen"
  | "Pollen"
  | "Honey";

export type Resource = {
  description: string;
};
export const RESOURCES: Record<ResourceName, Resource> = {
  Wood: {
    description: "Used to craft items",
  },
  Stone: {
    description: "Used to craft items",
  },
  Iron: {
    description: "Used to craft items",
  },
  Gold: {
    description: "Used to craft items",
  },
  Egg: {
    description: "Used to craft items",
  },
  Chicken: {
    description: "Used to lay eggs",
  },
  Bee: {
    description: "Used to collect pollen",
  },
  Drone: {
    description: "Used to process honey",
  },
  Queen: {
    description: "Used to make more bees",
  },
  Honey: {
    description: "Used to create delicious recipes",
  },
  Pollen:{
    description: "Used by drones to make honey",
  }
};
