import { Shirt, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";

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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/30 to-background" />
      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Shirt className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("dressCode")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: `${color}08` }}>🤵</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">{l("gentlemen")}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{male}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: `${color}08` }}>👗</div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">{l("ladies")}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{female}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DressCodeMFSection;
