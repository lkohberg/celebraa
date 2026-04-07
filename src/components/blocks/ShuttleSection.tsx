import { Bus, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface ShuttleRoute {
  time: string;
  from: string;
  to: string;
  note?: string;
}

const ShuttleSection = ({ routes, accentColor, lang }: { routes?: ShuttleRoute[]; accentColor?: string; lang?: EventLang }) => {
  const displayRoutes = routes && routes.length > 0 ? routes : [];
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displayRoutes.length === 0) return null;

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-card/80" />
      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Bus className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-xl md:text-3xl text-foreground">{l("shuttle")}</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-2">{l("shuttleSubtitle")}</p>
        </motion.div>

        <div className="space-y-3">
          {displayRoutes.map((route, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 md:gap-4 p-3.5 md:p-5 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-sm transition-shadow">
              <div className="font-display text-base md:text-lg font-bold min-w-[50px] md:min-w-[60px] text-center px-2 md:px-3 py-1.5 md:py-2 rounded-lg" style={{ color, backgroundColor: colorWithAlpha(color, 0.1) }}>{route.time}</div>
              <div className="flex-1">
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <span className="font-medium">{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{route.to}</span>
                </p>
                {route.note && <p className="font-body text-xs text-muted-foreground mt-1 italic">{route.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShuttleSection;
