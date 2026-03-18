import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon, Check } from "lucide-react";
import { useTranslation } from "@/i18n";

import heroBirthdayNeon from "@/assets/hero-birthday-neon.jpg";
import heroBirthdayGlamour from "@/assets/hero-birthday-glamour.jpg";
import heroBirthdayGarden from "@/assets/hero-birthday-garden.jpg";
import heroWeddingFloral from "@/assets/hero-wedding-floral.jpg";
import heroWeddingClassic from "@/assets/hero-wedding-classic.jpg";
import heroWeddingModern from "@/assets/hero-wedding-modern.jpg";
import heroCorporateExecutive from "@/assets/hero-corporate-executive.jpg";
import heroCorporateTech from "@/assets/hero-corporate-tech.jpg";
import heroCorporateGala from "@/assets/hero-corporate-gala.jpg";

const LIBRARY_IMAGES: Record<string, { url: string; label: string }[]> = {
  wedding: [
    { url: heroWeddingFloral, label: "Floral Romance (Original)" },
    { url: heroWeddingClassic, label: "Classic Elegance (Original)" },
    { url: heroWeddingModern, label: "Modern Love (Original)" },
    { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", label: "Classic Bouquet" },
    { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80", label: "Garden Ceremony" },
    { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80", label: "Beach Wedding" },
    { url: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=1200&q=80", label: "Rustic Barn" },
    { url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&q=80", label: "Flower Arch" },
    { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", label: "Table Setting" },
    { url: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=1200&q=80", label: "Sunset Couple" },
    { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80", label: "Vintage Romance" },
    { url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80", label: "Outdoor Dance" },
    { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80", label: "Castle Wedding" },
    { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1200&q=80", label: "Winter Wedding" },
  ],
  birthday: [
    { url: heroBirthdayNeon, label: "Neon Party (Original)" },
    { url: heroBirthdayGlamour, label: "Glamour Night (Original)" },
    { url: heroBirthdayGarden, label: "Garden Party (Original)" },
    { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80", label: "Balloons" },
    { url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80", label: "Confetti" },
    { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80", label: "Cake & Candles" },
    { url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1200&q=80", label: "Neon Party" },
    { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80", label: "Festival" },
    { url: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=1200&q=80", label: "Garden Party" },
    { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", label: "Sparklers" },
    { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80", label: "Dance Floor" },
    { url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80", label: "Friends Gathering" },
    { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80", label: "Concert Lights" },
    { url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1200&q=80", label: "Birthday Setup" },
  ],
  corporate: [
    { url: heroCorporateExecutive, label: "Executive Summit (Original)" },
    { url: heroCorporateTech, label: "Tech Conference (Original)" },
    { url: heroCorporateGala, label: "Gala Night (Original)" },
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", label: "Conference Hall" },
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80", label: "Keynote Stage" },
    { url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80", label: "Presentation" },
    { url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80", label: "Gala Dinner" },
    { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80", label: "Team Meeting" },
    { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=80", label: "Tech Event" },
    { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80", label: "Exhibition" },
    { url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80", label: "Graduation" },
    { url: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=1200&q=80", label: "Rooftop Event" },
  ],
};

interface HeroImageLibraryProps {
  category: "wedding" | "birthday" | "corporate";
  onSelect: (url: string) => void;
  currentImage?: string;
}

const HeroImageLibrary = ({ category, onSelect, currentImage }: HeroImageLibraryProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const images = LIBRARY_IMAGES[category] || [];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="font-body gap-2"
        onClick={() => setOpen(true)}
      >
        <ImageIcon className="w-4 h-4" />
        {t("order.imageLibrary") || "Bilder-Bibliothek"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{t("order.imageLibrary") || "Bilder-Bibliothek"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
            {images.map((img, i) => {
              const isSelected = currentImage === img.url;
              const isOriginal = img.label.includes("(Original)");
              return (
                <button
                  key={i}
                  onClick={() => { onSelect(img.url); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-[3/2] group ${
                    isSelected ? "border-primary ring-2 ring-primary/30" : isOriginal ? "border-primary/40" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img.url.startsWith("http") ? img.url.replace("w=1200", "w=300") : img.url}
                    alt={img.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  {isOriginal && !isSelected && (
                    <div className="absolute top-1 left-1 bg-primary/80 text-primary-foreground text-[7px] font-body font-semibold px-1.5 py-0.5 rounded-full">
                      Original
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] font-body px-1 py-0.5 text-center truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroImageLibrary;
