import { Gift, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface WishlistItem {
  name: string;
  url?: string;
  note?: string;
  hint?: string;
}

const WishlistSection = ({ items, accentColor, isPreview = false, lang }: { items?: WishlistItem[]; accentColor?: string; isPreview?: boolean; lang?: EventLang }) => {
  const displayItems = items && items.length > 0 ? items : [];
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-8 pb-20 md:py-20 md:pb-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4 md:mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full mb-2" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Gift className="w-4 h-4 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-lg md:text-3xl text-foreground">{l("wishlist")}</h2>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">{l("wishlistSubtitle")}</p>
        </motion.div>

        <div className="space-y-2">
          {displayItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group flex items-center justify-between p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-md md:rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: colorWithAlpha(color, 0.1) }}>
                  <Gift className="w-3 h-3 md:w-4 md:h-4" style={{ color, opacity: 0.6 }} />
                </div>
                <div>
                  <p className="font-body font-medium text-xs md:text-sm text-foreground">{item.name}</p>
                  {(item.note || item.hint) && <p className="font-body text-[10px] md:text-xs text-muted-foreground mt-0.5">{item.note || item.hint}</p>}
                </div>
              </div>
              {item.url && (
                <a href={isPreview ? "#" : item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary">
                  <ExternalLink className="w-3.5 h-3.5" />
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
