import Decimal from "decimal.js-light";
import { SeedName, SEEDS } from "../types/crops";
import { InventoryItemName } from "../types/game";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flag, FLAGS } from "./flags";
import { marketRate } from "../lib/halvening";
import { KNOWN_IDS, KNOWN_ITEMS } from ".";
import { OnChainLimitedItems } from "../lib/goblinMachine";

export { FLAGS };

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName =
  | LimitedItemName
  | Tool
  | SeedName
  | Food
  | Animal
  | Flag
  | HiveBee;

export interface Craftable {
  name: CraftableName;
  description: string;
  price?: Decimal;
  ingredients: Ingredient[];
  limit?: number;
  supply?: number;
  disabled?: boolean;
  requires?: InventoryItemName;
  section?: Section;
}

// NEW ===========

export type Ingredient = {
  id?: number;
  item: InventoryItemName;
  amount: Decimal;
};

export interface CraftableItem {
  id?: number;
  name: CraftableName;
  description: string;
  tokenAmount?: Decimal;
  ingredients?: Ingredient[];
  disabled?: boolean;
  requires?: InventoryItemName;
  workTime?: number;
}

export interface LimitedItem extends CraftableItem {
  maxSupply?: number;
  section?: Section;
  cooldownSeconds?: number;
  mintedAt?: number;
}

export type BlacksmithItem =
  | "Sunflower Statue"
  | "Potato Statue"
  | "Christmas Tree"
  | "Gnome"
  | "Sunflower Tombstone"
  | "Sunflower Rock"
  | "Goblin Crown"
  | "Fountain"
  | "Woody the Beaver"
  | "Apprentice Beaver"
  | "Foreman Beaver"
  | "Nyon Statue"
  | "Homeless Tent"
  | "Egg Basket"
  | "Farmer Bath"
  | "Bee Hive"
  | "Bee Box"
  | "Sunflower Cake";

export type BarnItem =
  | "Farm Cat"
  | "Farm Dog"
  | "Chicken Coop"
  | "Gold Egg"
  | "Easter Bunny";

export type MarketItem =
  | "Nancy"
  | "Scarecrow"
  | "Kuebiko"
  | "Golden Cauliflower"
  | "Mysterious Parsnip"
  | "Carrot Sword";

export type BeeItem = "Queen";

export type LimitedItemName =
  | BlacksmithItem
  | BarnItem
  | MarketItem
  | Flag
  | BeeItem;

export type Tool =
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Hammer"
  | "Rod"
  | "Net";

export type Food =
  | "Pumpkin Soup"
  | "Roasted Cauliflower"
  | "Sauerkraut"
  | "Radish Pie";

export type Animal = "Chicken" | "Cow" | "Pig" | "Sheep";

export type Bee = "Bee";
export type HiveBee = "Drone";

export const FOODS: () => Record<Food, CraftableItem> = () => ({
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description: "A creamy soup that goblins love",
    tokenAmount: marketRate(3),
    ingredients: [
      {
        item: "Pumpkin",
        amount: new Decimal(5),
      },
    ],
    limit: 1,
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description: "Fermented cabbage",
    tokenAmount: marketRate(25),
    ingredients: [
      {
        item: "Cabbage",
        amount: new Decimal(10),
      },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description: "A Goblin's favourite",
    tokenAmount: marketRate(150),
    ingredients: [
      {
        item: "Cauliflower",
        amount: new Decimal(30),
      },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description: "Despised by humans, loved by goblins",
    tokenAmount: marketRate(300),
    ingredients: [
      {
        item: "Radish",
        amount: new Decimal(60),
      },
    ],
  },
});

export const TOOLS: Record<Tool, CraftableItem> = {
  Axe: {
    name: "Axe",
    description: "Used to collect wood",
    tokenAmount: new Decimal(1),
    ingredients: [],
  },
  Pickaxe: {
    name: "Pickaxe",
    description: "Used to collect stone",
    tokenAmount: new Decimal(1),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(2),
      },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description: "Used to collect iron",
    tokenAmount: new Decimal(2),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Stone",
        amount: new Decimal(3),
      },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description: "Used to collect gold",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Iron",
        amount: new Decimal(3),
      },
    ],
  },
  Hammer: {
    name: "Hammer",
    description: "Used to construct buildings",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  Rod: {
    name: "Rod",
    description: "Used to fish trout",
    tokenAmount: new Decimal(5),
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
    ],
    disabled: true,
  },
  Net: {
    name: "Net",
    description: "Used to catch insects",
    tokenAmount: new Decimal(1),
    ingredients: [],
  },
};

export const BLACKSMITH_ITEMS: Record<BlacksmithItem, LimitedItem> = {
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description: "A symbol of the holy token",
    section: Section["Sunflower Statue"],
  },
  "Potato Statue": {
    name: "Potato Statue",
    description: "The OG potato hustler flex",
    section: Section["Potato Statue"],
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description: "Receive a Santa Airdrop on Christmas day",
    section: Section["Christmas Tree"],
  },
  Gnome: {
    name: "Gnome",
    description: "A lucky gnome",
    section: Section.Gnome,
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description: "A nice and cozy tent",
    section: Section.Tent,
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description: "In memory of Sunflower Farmers",
    section: Section["Sunflower Tombstone"],
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description: "The game that broke Polygon",
    section: Section["Sunflower Rock"],
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description: "Summon the leader of the Goblins",
    section: Section["Goblin Crown"],
  },
  Fountain: {
    name: "Fountain",
    description: "A relaxing fountain for your farm",
    section: Section.Fountain,
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description: "In memory of Nyon Lann",
    // TODO: Add section
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description: "A beetroot scented bath for the farmers",
    section: Section["Bath"],
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description: "Increase wood drops by 20%",
    section: Section.Beaver,
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description: "Trees recover 50% faster",
    section: Section.Beaver,
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description: "Cut trees without axes",
    section: Section.Beaver,
  },
  "Egg Basket": {
    name: "Egg Basket",
    description: "Gives access to the Easter Egg Hunt",
  },
  "Bee Hive": {
    name: "Bee Hive",
    description: "Gives access to the Hive for honey production",
  },
  "Bee Box": {
    name: "Bee Box",
    description: "Boost honey production",
  },
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description: "Give an energy boost to your farm animals",
  },
};

export const MARKET_ITEMS: Record<MarketItem, LimitedItem> = {
  Nancy: {
    name: "Nancy",
    description: "Keeps a few crows away. Crops grow 15% faster",
    section: Section.Scarecrow,
  },
  Scarecrow: {
    name: "Scarecrow",
    description: "A goblin scarecrow. Yield 20% more crops",
    section: Section.Scarecrow,
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    section: Section.Scarecrow,
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description: "Double the rewards from cauliflowers",
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description: "Parsnips grow 50% faster",
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description: "Increase chance of a mutant crop appearing",
  },
};

export const BARN_ITEMS: Record<BarnItem, LimitedItem> = {
  "Chicken Coop": {
    name: "Chicken Coop",
    description: "Collect 3x the amount of eggs",
    section: Section["Chicken Coop"],
  },
  "Farm Cat": {
    name: "Farm Cat",
    description: "Keep the rats away",
    section: Section["Farm Cat"],
  },
  "Farm Dog": {
    name: "Farm Dog",
    description: "Herd sheep 4x faster",
    section: Section["Farm Dog"],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description: "A rare egg, what lays inside?",
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description: "Earn 20% more Carrots",
    section: Section["Easter Bunny"],
  },
};

export const ANIMALS: Record<Animal, CraftableItem> = {
  Chicken: {
    name: "Chicken",
    description: "Produces eggs. Requires wheat for feeding",
    tokenAmount: new Decimal(5),
    ingredients: [],
    disabled: true,
  },
  Cow: {
    name: "Cow",
    description: "Produces milk. Requires wheat for feeding",
    tokenAmount: new Decimal(50),
    ingredients: [],
    disabled: true,
  },
  Pig: {
    name: "Pig",
    description: "Produces manure. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
  Sheep: {
    name: "Sheep",
    description: "Produces wool. Requires wheat for feeding",
    tokenAmount: new Decimal(20),
    ingredients: [],
    disabled: true,
  },
};

export const BEES: Record<HiveBee, CraftableItem> = {
  Drone: {
    name: "Drone",
    description: "Produces honey from bee's pollen",
    workTime: 60,
    tokenAmount: new Decimal(2),
    ingredients: [{ item: "Bee", amount: new Decimal(1) }],
  },
};

export const BEE_ITEMS: Record<BeeItem, CraftableItem> = {
  Queen: {
    name: "Queen",
    workTime: 10,
    description: "Earn an extra 5 bees per week",
    // section: Section["Bee Hive"],
  },
};

type Craftables = Record<CraftableName, CraftableItem>;

export const CRAFTABLES: () => Craftables = () => ({
  ...TOOLS,
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...SEEDS(),
  ...FOODS(),
  ...ANIMALS,
  ...FLAGS,
  ...BEES,
  ...BEE_ITEMS,
});

/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

const LIMITED_ITEMS = {
  ...BLACKSMITH_ITEMS,
  ...BARN_ITEMS,
  ...MARKET_ITEMS,
  ...FLAGS,
};

export const LIMITED_ITEM_NAMES = getKeys(LIMITED_ITEMS);

export const makeLimitedItemsByName = (
  items: Partial<Record<LimitedItemName, LimitedItem>>,
  onChainItems: OnChainLimitedItems
) => {
  return getKeys(items).reduce((limitedItems, itemName) => {
    const name = itemName as LimitedItemName;
    // Get id form limited item name
    const id = KNOWN_IDS[name];
    // Get onchain item based on id
    const onChainItem = onChainItems[id];

    if (onChainItem) {
      const {
        tokenAmount,
        ingredientAmounts,
        ingredientIds,
        cooldownSeconds,
        maxSupply,
        mintedAt,
      } = onChainItem;

      // Build ingredients
      const ingredients = ingredientIds.map((id, index) => ({
        id,
        item: KNOWN_ITEMS[id],
        amount: new Decimal(ingredientAmounts[index]),
      }));

      limitedItems[name] = {
        id: onChainItem.mintId,
        name,
        description: items[name]?.description as string,
        tokenAmount: new Decimal(tokenAmount),
        maxSupply,
        cooldownSeconds,
        ingredients,
        mintedAt,
      };
    }

    return limitedItems;
    // TODO: FIX TYPE
  }, {} as Record<CraftableName, LimitedItem>);
};
