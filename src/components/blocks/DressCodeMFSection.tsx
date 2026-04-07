import { Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface DressCodeMF {
  male: string;
  female: string;
}

const DressCodeMFSection = ({ dressCode, accentColor, lang }: { dressCode?: DressCodeMF; accentColor?: string; lang?: EventLang }) => {
  const male = dressCode?.male || "";
  const female = dressCode?.female || "";
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (!male && !female) return null;

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Shirt className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-xl md:text-3xl text-foreground">{l("dressCode")}</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-4 md:p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl md:text-4xl" style={{ backgroundColor: colorWithAlpha(color, 0.08) }}>🤵</div>
            <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-2">{l("gentlemen")}</h3>
            <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">{male}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-4 md:p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl md:text-4xl" style={{ backgroundColor: colorWithAlpha(color, 0.08) }}>👗</div>
            <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-2">{l("ladies")}</h3>
            <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">{female}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DressCodeMFSection;
