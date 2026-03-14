// Block and Package definitions for the order flow
// Names, descriptions, and manual work descriptions use i18n keys
// that are resolved at render time via the t() function

export interface Block {
  id: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  category: "wedding" | "birthday" | "corporate";
  icon: string; // emoji
  requiresManualWork?: boolean;
  manualWorkDescriptionKey?: string;
}

export interface Package {
  id: string;
  nameKey: string;
  price: number;
  blockIds: string[];
  category: "wedding" | "birthday" | "corporate";
}

export const BASE_PRICE = 19;

export const MANUAL_BLOCK_SUFFIXES = ["-illustration", "-musicpro", "-bgmusic"];

export const isManualBlock = (blockId: string) =>
  MANUAL_BLOCK_SUFFIXES.some(suffix => blockId.endsWith(suffix));

export const hasManualBlocks = (blockIds: string[]) =>
  blockIds.some(id => isManualBlock(id));

export const blocks: Block[] = [
  // Wedding
  { id: "wedding-timeline", nameKey: "block.timeline", descriptionKey: "block.desc.timeline", price: 9, category: "wedding", icon: "🕐" },
  { id: "wedding-story", nameKey: "block.story", descriptionKey: "block.desc.story", price: 9, category: "wedding", icon: "💕" },
  { id: "wedding-wishlist", nameKey: "block.wishlist", descriptionKey: "block.desc.wishlist", price: 9, category: "wedding", icon: "🎁" },
  { id: "wedding-dresscode", nameKey: "block.dresscode", descriptionKey: "block.desc.dresscode", price: 9, category: "wedding", icon: "👔" },
  { id: "wedding-bgmusic", nameKey: "block.bgmusic", descriptionKey: "block.desc.bgmusic", price: 9, category: "wedding", icon: "🎶", requiresManualWork: true, manualWorkDescriptionKey: "block.manual.bgmusic" },
  { id: "wedding-videomsg", nameKey: "block.videomsg", descriptionKey: "block.desc.videomsg", price: 9, category: "wedding", icon: "🎬" },
  { id: "wedding-hotels", nameKey: "block.hotels", descriptionKey: "block.desc.hotels", price: 19, category: "wedding", icon: "🏨" },
  { id: "wedding-slideshow", nameKey: "block.slideshow", descriptionKey: "block.desc.slideshow", price: 19, category: "wedding", icon: "📸" },
  { id: "wedding-menu", nameKey: "block.menu", descriptionKey: "block.desc.menu", price: 19, category: "wedding", icon: "🍽️" },
  { id: "wedding-shuttle", nameKey: "block.shuttle", descriptionKey: "block.desc.shuttle", price: 19, category: "wedding", icon: "🚌" },
  { id: "wedding-musicpro", nameKey: "block.musicpro", descriptionKey: "block.desc.musicpro", price: 19, category: "wedding", icon: "🎵", requiresManualWork: true, manualWorkDescriptionKey: "block.manual.musicpro" },
  { id: "wedding-illustration", nameKey: "block.illustration", descriptionKey: "block.desc.illustration", price: 29, category: "wedding", icon: "🎨", requiresManualWork: true, manualWorkDescriptionKey: "block.manual.illustration" },

  // Corporate
  { id: "business-timeline", nameKey: "block.timeline", descriptionKey: "block.desc.timeline.business", price: 9, category: "corporate", icon: "🕐" },
  { id: "business-dresscode", nameKey: "block.dresscode.single", descriptionKey: "block.desc.dresscode.single", price: 9, category: "corporate", icon: "👔" },
  { id: "business-bgmusic", nameKey: "block.bgmusic", descriptionKey: "block.desc.bgmusic", price: 9, category: "corporate", icon: "🎶", requiresManualWork: true, manualWorkDescriptionKey: "block.manual.bgmusic" },
  { id: "business-videomsg", nameKey: "block.videomsg.corporate", descriptionKey: "block.desc.videomsg.corporate", price: 9, category: "corporate", icon: "🎬" },
  { id: "business-hotels", nameKey: "block.hotels", descriptionKey: "block.desc.hotels.business", price: 9, category: "corporate", icon: "🏨" },
  { id: "business-menu", nameKey: "block.menu", descriptionKey: "block.desc.menu.business", price: 9, category: "corporate", icon: "🍽️" },
  { id: "business-agenda", nameKey: "block.agenda", descriptionKey: "block.desc.agenda", price: 9, category: "corporate", icon: "📋" },
  { id: "business-products", nameKey: "block.products", descriptionKey: "block.desc.products", price: 19, category: "corporate", icon: "📦" },
  { id: "business-sponsors", nameKey: "block.sponsors", descriptionKey: "block.desc.sponsors", price: 19, category: "corporate", icon: "🤝" },

  // Birthday/Party
  { id: "party-timeline", nameKey: "block.timeline", descriptionKey: "block.desc.timeline.party", price: 5, category: "birthday", icon: "🕐" },
  { id: "party-musicwish", nameKey: "block.musicwish", descriptionKey: "block.desc.musicwish", price: 5, category: "birthday", icon: "🎵" },
  { id: "party-wishlist", nameKey: "block.wishlist", descriptionKey: "block.desc.wishlist.party", price: 5, category: "birthday", icon: "🎁" },
  { id: "party-dresscode", nameKey: "block.dresscode", descriptionKey: "block.desc.dresscode.party", price: 5, category: "birthday", icon: "👔" },
  { id: "party-bgmusic", nameKey: "block.bgmusic", descriptionKey: "block.desc.bgmusic", price: 5, category: "birthday", icon: "🎶", requiresManualWork: true, manualWorkDescriptionKey: "block.manual.bgmusic" },
  { id: "party-videomsg", nameKey: "block.videomsg", descriptionKey: "block.desc.videomsg", price: 5, category: "birthday", icon: "🎬" },
  { id: "party-quiz", nameKey: "block.quiz", descriptionKey: "block.desc.quiz", price: 9, category: "birthday", icon: "❓" },
  { id: "party-menu", nameKey: "block.menu", descriptionKey: "block.desc.menu.party", price: 9, category: "birthday", icon: "🍽️" },
  { id: "party-games", nameKey: "block.games", descriptionKey: "block.desc.games", price: 9, category: "birthday", icon: "🎮" },
  { id: "party-potluck", nameKey: "block.potluck", descriptionKey: "block.desc.potluck", price: 9, category: "birthday", icon: "🧺" },
];

export const packages: Package[] = [
  { id: "wedding-starter", nameKey: "pkg.wedding.starter", price: 39, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle"], category: "wedding" },
  { id: "wedding-plus", nameKey: "pkg.wedding.plus", price: 49, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu"], category: "wedding" },
  { id: "wedding-premium", nameKey: "pkg.wedding.premium", price: 79, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu", "wedding-slideshow", "wedding-story", "wedding-wishlist"], category: "wedding" },
  { id: "business-starter", nameKey: "pkg.business.starter", price: 29, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda"], category: "corporate" },
  { id: "business-pro", nameKey: "pkg.business.pro", price: 49, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda", "business-products", "business-sponsors"], category: "corporate" },
  { id: "party-fun", nameKey: "pkg.party.fun", price: 25, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz"], category: "birthday" },
  { id: "party-planer", nameKey: "pkg.party.planer", price: 25, blockIds: ["party-timeline", "party-menu", "party-potluck", "party-dresscode"], category: "birthday" },
  { id: "party-allin", nameKey: "pkg.party.allin", price: 45, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz", "party-menu", "party-potluck", "party-dresscode", "party-wishlist"], category: "birthday" },
];

export const getBlocksForCategory = (category: "wedding" | "birthday" | "corporate") =>
  blocks.filter(b => b.category === category);

export const getPackagesForCategory = (category: "wedding" | "birthday" | "corporate") =>
  packages.filter(p => p.category === category);

export const calculatePrice = (selectedBlockIds: string[], selectedPackageId?: string): number => {
  if (selectedPackageId) {
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (pkg) {
      const extraBlocks = selectedBlockIds.filter(id => !pkg.blockIds.includes(id));
      const extraPrice = extraBlocks.reduce((sum, id) => {
        const block = blocks.find(b => b.id === id);
        return sum + (block?.price || 0);
      }, 0);
      return BASE_PRICE + pkg.price + extraPrice;
    }
  }
  const blocksPrice = selectedBlockIds.reduce((sum, id) => {
    const block = blocks.find(b => b.id === id);
    return sum + (block?.price || 0);
  }, 0);
  return BASE_PRICE + blocksPrice;
};

export const getAllSelectedBlockIds = (selectedBlockIds: string[], selectedPackageId?: string): string[] => {
  const ids = new Set(selectedBlockIds);
  if (selectedPackageId) {
    const pkg = packages.find(p => p.id === selectedPackageId);
    if (pkg) {
      pkg.blockIds.forEach(id => ids.add(id));
    }
  }
  return Array.from(ids);
};

export const getManualBlocks = (selectedBlockIds: string[]): Block[] =>
  selectedBlockIds
    .filter(id => isManualBlock(id))
    .map(id => blocks.find(b => b.id === id)!)
    .filter(Boolean);
