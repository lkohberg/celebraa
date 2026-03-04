export const BASE_PRICE = 19;

export type EventType = "wedding" | "corporate" | "birthday";

export interface Block {
  id: string;
  labelKey: string;
  price: number;
}

export interface Package {
  id: string;
  nameKey: string;
  includedBlockIds: string[];
  price: number;
}

export interface PricingResult {
  base: number;
  addons: number;
  total: number;
}

export const blocks: Record<EventType, Block[]> = {
  wedding: [
    { id: "timeline", labelKey: "blocks.timeline", price: 9 },
    { id: "our_story", labelKey: "blocks.ourStory", price: 9 },
    { id: "hotels", labelKey: "blocks.hotels", price: 19 },
    { id: "wishlist", labelKey: "blocks.wishlist", price: 9 },
    { id: "slideshow", labelKey: "blocks.slideshow", price: 19 },
    { id: "dress_code", labelKey: "blocks.dressCode", price: 9 },
    { id: "menu", labelKey: "blocks.menu", price: 19 },
    { id: "music_pro", labelKey: "blocks.musicPro", price: 39 },
    { id: "custom_music", labelKey: "blocks.customMusic", price: 9 },
    { id: "bus_shuttle", labelKey: "blocks.busShuttle", price: 19 },
    { id: "illustration", labelKey: "blocks.illustration", price: 29 },
  ],
  corporate: [
    { id: "timeline", labelKey: "blocks.timeline", price: 9 },
    { id: "hotels", labelKey: "blocks.hotels", price: 19 },
    { id: "dress_code", labelKey: "blocks.dressCode", price: 9 },
    { id: "menu", labelKey: "blocks.menu", price: 19 },
    { id: "products", labelKey: "blocks.products", price: 19 },
    { id: "agenda", labelKey: "blocks.agenda", price: 19 },
    { id: "sponsors", labelKey: "blocks.sponsors", price: 19 },
  ],
  birthday: [
    { id: "timeline", labelKey: "blocks.timeline", price: 9 },
    { id: "quiz", labelKey: "blocks.quiz", price: 19 },
    { id: "menu", labelKey: "blocks.menu", price: 19 },
    { id: "game_vote", labelKey: "blocks.gameVote", price: 19 },
    { id: "wish_music", labelKey: "blocks.wishMusic", price: 9 },
    { id: "bring_list", labelKey: "blocks.bringList", price: 19 },
    { id: "wishlist", labelKey: "blocks.wishlist", price: 9 },
    { id: "dress_code", labelKey: "blocks.dressCode", price: 9 },
  ],
};

export const packages: Record<EventType, Package[]> = {
  wedding: [
    {
      id: "wedding_starter",
      nameKey: "packages.weddingStarter",
      includedBlockIds: ["timeline", "dress_code", "hotels", "bus_shuttle"],
      price: 49,
    },
    {
      id: "wedding_plus",
      nameKey: "packages.weddingPlus",
      includedBlockIds: ["timeline", "dress_code", "hotels", "bus_shuttle", "menu"],
      price: 69,
    },
    {
      id: "wedding_premium",
      nameKey: "packages.weddingPremium",
      includedBlockIds: [
        "timeline",
        "dress_code",
        "hotels",
        "bus_shuttle",
        "menu",
        "slideshow",
        "our_story",
        "wishlist",
      ],
      price: 99,
    },
  ],
  corporate: [
    {
      id: "business_starter",
      nameKey: "packages.businessStarter",
      includedBlockIds: ["timeline", "dress_code", "hotels", "agenda"],
      price: 49,
    },
    {
      id: "business_pro",
      nameKey: "packages.businessPro",
      includedBlockIds: ["timeline", "dress_code", "hotels", "agenda", "products", "sponsors"],
      price: 79,
    },
  ],
  birthday: [
    {
      id: "party_fun",
      nameKey: "packages.partyFun",
      includedBlockIds: ["timeline", "wish_music", "game_vote", "quiz"],
      price: 49,
    },
    {
      id: "party_planner",
      nameKey: "packages.partyPlanner",
      includedBlockIds: ["timeline", "menu", "bring_list", "dress_code"],
      price: 49,
    },
    {
      id: "party_all_in",
      nameKey: "packages.partyAllIn",
      includedBlockIds: [
        "timeline",
        "wish_music",
        "game_vote",
        "quiz",
        "menu",
        "bring_list",
        "dress_code",
        "wishlist",
      ],
      price: 79,
    },
  ],
};

/**
 * Calculate total price for an order.
 * Package prices are TOTAL prices (inclusive of the €19 base).
 * Custom: base + sum of selected block prices.
 */
export function calculatePricing(
  eventType: EventType,
  selectedBlockIds: string[],
  packageId?: string
): PricingResult {
  if (packageId) {
    const pkg = packages[eventType].find((p) => p.id === packageId);
    if (pkg) {
      // addons = package-over-base premium; total = pkg.price
      return { base: BASE_PRICE, addons: pkg.price - BASE_PRICE, total: pkg.price };
    }
  }

  const eventBlocks = blocks[eventType];
  const addons = selectedBlockIds.reduce((sum, blockId) => {
    const block = eventBlocks.find((b) => b.id === blockId);
    return sum + (block?.price ?? 0);
  }, 0);

  return { base: BASE_PRICE, addons, total: BASE_PRICE + addons };
}


