// Block and Package definitions for the order flow

export interface Block {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "wedding" | "birthday" | "corporate";
  icon: string; // emoji
}

export interface Package {
  id: string;
  name: string;
  price: number;
  blockIds: string[];
  category: "wedding" | "birthday" | "corporate";
}

export const BASE_PRICE = 19;

export const blocks: Block[] = [
  // Wedding
  { id: "wedding-timeline", name: "Timeline", description: "Ablauf als Zeitstrahl (Uhrzeit + Text).", price: 9, category: "wedding", icon: "🕐" },
  { id: "wedding-story", name: "Our Story", description: "Story-Sektion über das Paar.", price: 9, category: "wedding", icon: "💕" },
  { id: "wedding-hotels", name: "Hotelempfehlungen", description: "Hotels in der Nähe (Liste + Links).", price: 19, category: "wedding", icon: "🏨" },
  { id: "wedding-wishlist", name: "Wunschliste / Geschenke", description: "Geschenkewünsche + Links/Hinweis.", price: 9, category: "wedding", icon: "🎁" },
  { id: "wedding-slideshow", name: "Fotos rotieren (Slideshow)", description: "Automatisch rotierende Fotos des Paars.", price: 19, category: "wedding", icon: "📸" },
  { id: "wedding-dresscode", name: "Dress Code (M/F)", description: "Dresscode getrennt für Männer/Frauen.", price: 9, category: "wedding", icon: "👔" },
  { id: "wedding-menu", name: "Essensmenü", description: "Menü-/Speisen-Sektion.", price: 19, category: "wedding", icon: "🍽️" },
  { id: "wedding-musicpro", name: "Music Pro + DJ-Export", description: "Songwünsche sammeln + Export für DJ.", price: 39, category: "wedding", icon: "🎵" },
  { id: "wedding-bgmusic", name: "Musik beim Öffnen", description: "Audio/Intro beim Öffnen der Seite.", price: 9, category: "wedding", icon: "🎶" },
  { id: "wedding-shuttle", name: "Bus & Shuttle Zeiten", description: "Shuttleplan mit Zeiten/Infos.", price: 19, category: "wedding", icon: "🚌" },
  { id: "wedding-illustration", name: "Custom Illustration (KI)", description: "KI-generierte Illustration vom Ort/Location als Sektion.", price: 29, category: "wedding", icon: "🎨" },

  // Corporate
  { id: "business-timeline", name: "Timeline", description: "Ablauf/Slots als Zeitstrahl.", price: 9, category: "corporate", icon: "🕐" },
  { id: "business-hotels", name: "Hotels", description: "Hotel-Empfehlungen (Liste + Links).", price: 19, category: "corporate", icon: "🏨" },
  { id: "business-dresscode", name: "Dress Code", description: "Dresscode-Hinweis.", price: 9, category: "corporate", icon: "👔" },
  { id: "business-menu", name: "Essensmenü", description: "Catering-/Menü-Sektion.", price: 19, category: "corporate", icon: "🍽️" },
  { id: "business-products", name: "Produkte (Fotos + Text)", description: "Produkt-Kacheln (Bild + Beschreibung).", price: 19, category: "corporate", icon: "📦" },
  { id: "business-agenda", name: "Agenda", description: "Agenda/Sessions Übersicht.", price: 19, category: "corporate", icon: "📋" },
  { id: "business-sponsors", name: "Sponsoren", description: "Sponsor-Logos + Links.", price: 19, category: "corporate", icon: "🤝" },

  // Birthday/Party
  { id: "party-timeline", name: "Timeline", description: "Party-Ablauf als Zeitstrahl.", price: 9, category: "birthday", icon: "🕐" },
  { id: "party-quiz", name: "Quiz/Abstimmung über Host", description: "Quiz/Umfrage (Fragen + Ergebnisse).", price: 19, category: "birthday", icon: "❓" },
  { id: "party-menu", name: "Menü Essen", description: "Menü-/Snacks-Sektion.", price: 19, category: "birthday", icon: "🍽️" },
  { id: "party-games", name: "Spiele-Abstimmung", description: "Poll: welche Spiele, Ergebnisanzeige.", price: 19, category: "birthday", icon: "🎮" },
  { id: "party-musicwish", name: "Wunschmusik", description: "Songwünsche einsammeln.", price: 9, category: "birthday", icon: "🎵" },
  { id: "party-potluck", name: "Mitbringliste", description: "\"Wer bringt was mit?\" Liste.", price: 19, category: "birthday", icon: "🧺" },
  { id: "party-wishlist", name: "Wunschliste", description: "Dinge/Links, die sich der Host wünscht.", price: 9, category: "birthday", icon: "🎁" },
  { id: "party-dresscode", name: "Dress Code (M/F)", description: "Dresscode getrennt Männer/Frauen.", price: 9, category: "birthday", icon: "👔" },
];

export const packages: Package[] = [
  // Wedding
  { id: "wedding-starter", name: "Hochzeit Starter", price: 49, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle"], category: "wedding" },
  { id: "wedding-plus", name: "Hochzeit Plus", price: 69, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu"], category: "wedding" },
  { id: "wedding-premium", name: "Hochzeit Premium", price: 99, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-menu", "wedding-slideshow", "wedding-story", "wedding-wishlist"], category: "wedding" },

  // Business
  { id: "business-starter", name: "Business Starter", price: 49, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda"], category: "corporate" },
  { id: "business-pro", name: "Business Pro", price: 79, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda", "business-products", "business-sponsors"], category: "corporate" },

  // Party
  { id: "party-fun", name: "Party Fun", price: 49, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz"], category: "birthday" },
  { id: "party-planer", name: "Party Planer", price: 49, blockIds: ["party-timeline", "party-menu", "party-potluck", "party-dresscode"], category: "birthday" },
  { id: "party-allin", name: "Party All-in", price: 79, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz", "party-menu", "party-potluck", "party-dresscode", "party-wishlist"], category: "birthday" },
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
