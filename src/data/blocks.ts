// Block and Package definitions for the order flow

export interface Block {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "wedding" | "birthday" | "corporate";
  icon: string; // emoji
  requiresManualWork?: boolean; // blocks that need admin to fulfill manually
  manualWorkDescription?: string; // what the customer needs to provide
}

export interface Package {
  id: string;
  name: string;
  price: number;
  blockIds: string[];
  category: "wedding" | "birthday" | "corporate";
}

export const BASE_PRICE = 19;

// MANUAL_BLOCKS: blocks that require admin intervention before event can go live
export const MANUAL_BLOCK_SUFFIXES = ["-illustration", "-musicpro", "-bgmusic"];

export const isManualBlock = (blockId: string) =>
  MANUAL_BLOCK_SUFFIXES.some(suffix => blockId.endsWith(suffix));

export const hasManualBlocks = (blockIds: string[]) =>
  blockIds.some(id => isManualBlock(id));

// Sorted by price ascending within each category
export const blocks: Block[] = [
  // Wedding — sorted cheap → expensive
  { id: "wedding-timeline", name: "Timeline", description: "Ablauf als Zeitstrahl (Uhrzeit + Text).", price: 9, category: "wedding", icon: "🕐" },
  { id: "wedding-story", name: "Our Story", description: "Story-Sektion über das Paar.", price: 9, category: "wedding", icon: "💕" },
  { id: "wedding-wishlist", name: "Wunschliste / Geschenke", description: "Geschenkewünsche + Links/Hinweis.", price: 9, category: "wedding", icon: "🎁" },
  { id: "wedding-dresscode", name: "Dress Code (M/F)", description: "Dresscode getrennt für Männer/Frauen.", price: 9, category: "wedding", icon: "👔" },
  { id: "wedding-bgmusic", name: "Musik beim Öffnen", description: "Dein Lieblingssong als Intro beim Öffnen der Seite.", price: 9, category: "wedding", icon: "🎶", requiresManualWork: true, manualWorkDescription: "Bitte lade deinen gewünschten Song hoch oder teile uns den Titel mit." },
  { id: "wedding-hotels", name: "Hotelempfehlungen", description: "Hotels in der Nähe (Liste + Links).", price: 19, category: "wedding", icon: "🏨" },
  { id: "wedding-slideshow", name: "Fotos rotieren (Slideshow)", description: "Automatisch rotierende Fotos des Paars.", price: 19, category: "wedding", icon: "📸" },
  { id: "wedding-menu", name: "Essensmenü", description: "Menü-/Speisen-Sektion.", price: 19, category: "wedding", icon: "🍽️" },
  { id: "wedding-shuttle", name: "Bus & Shuttle Zeiten", description: "Shuttleplan mit Zeiten/Infos.", price: 19, category: "wedding", icon: "🚌" },
  { id: "wedding-musicpro", name: "Music Pro + DJ-Export", description: "Songwünsche sammeln + Export für DJ.", price: 19, category: "wedding", icon: "🎵", requiresManualWork: true, manualWorkDescription: "Wir richten die DJ-Export-Funktion für dich ein." },
  { id: "wedding-illustration", name: "Custom Illustration", description: "Handgefertigte Illustration deiner Location als Sektion.", price: 29, category: "wedding", icon: "🎨", requiresManualWork: true, manualWorkDescription: "Bitte teile uns den Namen und die Adresse deiner Location mit, damit wir die Illustration erstellen können." },

  // Corporate — sorted cheap → expensive
  { id: "business-timeline", name: "Timeline", description: "Ablauf/Slots als Zeitstrahl.", price: 9, category: "corporate", icon: "🕐" },
  { id: "business-dresscode", name: "Dress Code", description: "Dresscode-Hinweis.", price: 9, category: "corporate", icon: "👔" },
  { id: "business-hotels", name: "Hotels", description: "Hotel-Empfehlungen (Liste + Links).", price: 9, category: "corporate", icon: "🏨" },
  { id: "business-menu", name: "Essensmenü", description: "Catering-/Menü-Sektion.", price: 9, category: "corporate", icon: "🍽️" },
  { id: "business-agenda", name: "Agenda", description: "Agenda/Sessions Übersicht.", price: 9, category: "corporate", icon: "📋" },
  { id: "business-products", name: "Produkte (Fotos + Text)", description: "Produkt-Kacheln (Bild + Beschreibung).", price: 19, category: "corporate", icon: "📦" },
  { id: "business-sponsors", name: "Sponsoren", description: "Sponsor-Logos + Links.", price: 19, category: "corporate", icon: "🤝" },

  // Birthday/Party — ALL max €9, sorted cheap → expensive
  { id: "party-timeline", name: "Timeline", description: "Party-Ablauf als Zeitstrahl.", price: 5, category: "birthday", icon: "🕐" },
  { id: "party-musicwish", name: "Wunschmusik", description: "Songwünsche einsammeln.", price: 5, category: "birthday", icon: "🎵" },
  { id: "party-wishlist", name: "Wunschliste", description: "Dinge/Links, die sich der Host wünscht.", price: 5, category: "birthday", icon: "🎁" },
  { id: "party-dresscode", name: "Dress Code (M/F)", description: "Dresscode getrennt Männer/Frauen.", price: 5, category: "birthday", icon: "👔" },
  { id: "party-quiz", name: "Quiz/Abstimmung über Host", description: "Quiz/Umfrage (Fragen + Ergebnisse).", price: 9, category: "birthday", icon: "❓" },
  { id: "party-menu", name: "Menü Essen", description: "Menü-/Snacks-Sektion.", price: 9, category: "birthday", icon: "🍽️" },
  { id: "party-games", name: "Spiele-Abstimmung", description: "Poll: welche Spiele, Ergebnisanzeige.", price: 9, category: "birthday", icon: "🎮" },
  { id: "party-potluck", name: "Mitbringliste", description: "\"Wer bringt was mit?\" Liste.", price: 9, category: "birthday", icon: "🧺" },
];

export const packages: Package[] = [
  // Wedding — adjusted prices
  { id: "wedding-starter", name: "Hochzeit Starter", price: 39, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle"], category: "wedding" },
  { id: "wedding-plus", name: "Hochzeit Plus", price: 49, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu"], category: "wedding" },
  { id: "wedding-premium", name: "Hochzeit Premium", price: 79, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu", "wedding-slideshow", "wedding-story", "wedding-wishlist"], category: "wedding" },

  // Business — adjusted prices
  { id: "business-starter", name: "Business Starter", price: 29, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda"], category: "corporate" },
  { id: "business-pro", name: "Business Pro", price: 49, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda", "business-products", "business-sponsors"], category: "corporate" },

  // Party — adjusted prices (all blocks max €9)
  { id: "party-fun", name: "Party Fun", price: 25, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz"], category: "birthday" },
  { id: "party-planer", name: "Party Planer", price: 25, blockIds: ["party-timeline", "party-menu", "party-potluck", "party-dresscode"], category: "birthday" },
  { id: "party-allin", name: "Party All-in", price: 45, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz", "party-menu", "party-potluck", "party-dresscode", "party-wishlist"], category: "birthday" },
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

// Get all selected block IDs (from package + individual selections)
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

// Get manual blocks from selection
export const getManualBlocks = (selectedBlockIds: string[]): Block[] =>
  selectedBlockIds
    .filter(id => isManualBlock(id))
    .map(id => blocks.find(b => b.id === id)!)
    .filter(Boolean);
