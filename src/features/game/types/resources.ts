export type ResourceName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Egg"
  | "Chicken"
  | "Bee"
  | "Queen"
  | "Drone"
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
    description: "Used to collect pollen from flowers",
  },
  Queen: {
    description: "Runs the hive, produces more bees",
  },
  Honey: {
    description: "Delicious honey for all sort of things",
  },
  Pollen: {
    description: "Processed by drones to make honey",
  },
  Drone: {
    description: "Takes pollen from bees and transforms into honey",
  },
};
