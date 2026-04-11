import { UtensilsCrossed, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface MenuItem {
  course?: string;
  name: string;
  description?: string;
}

const FoodMenuSection = ({ menu, accentColor, lang }: { menu?: MenuItem[]; accentColor?: string; lang?: EventLang }) => {
  const displayMenu = menu && menu.length > 0 ? menu : [];
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displayMenu.length === 0) return null;

  return (
    <section className="py-10 pb-20 md:py-24 md:pb-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/80 to-card" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-5 md:mb-14">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full mb-2.5" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <UtensilsCrossed className="w-4 h-4 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-lg md:text-3xl text-foreground">{l("menu")}</h2>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 p-4 md:p-12 shadow-sm">
          <div className="space-y-5 md:space-y-10">
            {displayMenu.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                {item.course && <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color }}>{item.course}</p>}
                <h3 className="font-display text-base md:text-2xl text-foreground mb-0.5">{item.name}</h3>
                {item.description && <p className="font-body text-[11px] md:text-sm text-muted-foreground italic">{item.description}</p>}
                {i < displayMenu.length - 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 md:mt-8">
                    <div className="w-5 h-px" style={{ backgroundColor: color, opacity: 0.2 }} />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color, opacity: 0.2 }} />
                    <div className="w-5 h-px" style={{ backgroundColor: color, opacity: 0.2 }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodMenuSection;
