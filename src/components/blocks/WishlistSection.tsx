import { Gift, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface WishlistItem {
  name: string;
  url?: string;
  note?: string;
  hint?: string;
}

const demoItems: WishlistItem[] = [
  { name: "Beitrag zur Hochzeitsreise", hint: "Wir träumen von einer Reise nach Santorini 🇬🇷" },
  { name: "KitchenAid Küchenmaschine", url: "https://example.com" },
  { name: "Gutschein für ein Abendessen zu zweit" },
];

const WishlistSection = ({ items, accentColor, isPreview = false }: { items?: WishlistItem[]; accentColor?: string; isPreview?: boolean }) => {
  const displayItems = items && items.length > 0 ? items : demoItems;
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Gift className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Wunschliste</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3 max-w-md mx-auto">Eure Anwesenheit ist das schönste Geschenk! Wer uns dennoch eine Freude machen möchte:</p>
        </motion.div>

        <div className="space-y-3">
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center justify-between p-5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${color}10` }}>
                  <Gift className="w-4 h-4" style={{ color, opacity: 0.6 }} />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{item.name}</p>
                  {(item.note || item.hint) && <p className="font-body text-xs text-muted-foreground mt-1">{item.note || item.hint}</p>}
                </div>
              </div>
              {item.url && (
                <a href={isPreview ? "#" : item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary">
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
