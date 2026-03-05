import { Gift, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface WishlistItem {
  name: string;
  url?: string;
  note?: string;
}

const demoItems: WishlistItem[] = [
  { name: "Beitrag zur Hochzeitsreise", note: "Wir träumen von einer Reise nach Santorini 🇬🇷" },
  { name: "KitchenAid Küchenmaschine", url: "https://example.com" },
  { name: "Gutschein für ein Abendessen zu zweit" },
];

const WishlistSection = ({ items, accentColor, isPreview = false }: { items?: WishlistItem[]; accentColor?: string; isPreview?: boolean }) => {
  const displayItems = items && items.length > 0 ? items : demoItems;
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <Gift className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Wunschliste</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Eure Anwesenheit ist das schönste Geschenk! Wer uns dennoch eine Freude machen möchte:</p>
        </div>
        <div className="space-y-4">
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
            >
              <div>
                <p className="font-body font-medium text-foreground">{item.name}</p>
                {item.note && <p className="font-body text-xs text-muted-foreground mt-1">{item.note}</p>}
              </div>
              {item.url && (
                <a href={isPreview ? "#" : item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WishlistSection;
