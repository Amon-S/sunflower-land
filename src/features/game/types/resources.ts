export type ResourceName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Egg"
  | "Chicken"
  | "Bee"
  | "Drone"
  | "Honey"
  | "Pollen"
  | "Queen";

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
    description: "Used to gather pollen from flowers",
  },
  Drone: {
    description: "Used to transform pollen into honey",
  },
  Pollen: {
    description: "Used to make honey",
  },
  Honey: {
    description: "Used to craft delicious recipes",
  },
  Queen: {
    description: "Used to lay bee larvae",
  },
};
