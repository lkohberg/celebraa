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
    <section className="py-8 pb-20 md:py-20 md:pb-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-4 md:mb-12">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full mb-2" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Shirt className="w-4 h-4 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-lg md:text-3xl text-foreground">{l("dressCode")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-2.5 md:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-3 md:p-8 bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-xl md:text-4xl" style={{ backgroundColor: colorWithAlpha(color, 0.08) }}>🤵</div>
            <h3 className="font-display text-sm md:text-lg font-semibold text-foreground mb-1">{l("gentlemen")}</h3>
            <p className="font-body text-[11px] md:text-sm text-muted-foreground leading-relaxed">{male}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-3 md:p-8 bg-card/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-xl md:text-4xl" style={{ backgroundColor: colorWithAlpha(color, 0.08) }}>👗</div>
            <h3 className="font-display text-sm md:text-lg font-semibold text-foreground mb-1">{l("ladies")}</h3>
            <p className="font-body text-[11px] md:text-sm text-muted-foreground leading-relaxed">{female}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DressCodeMFSection;
