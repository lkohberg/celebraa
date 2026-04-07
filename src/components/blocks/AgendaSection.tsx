import { ClipboardList, Sparkles, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

const AgendaSection = ({ agenda, accentColor, lang }: { agenda?: AgendaItem[]; accentColor?: string; lang?: EventLang }) => {
  const displayAgenda = agenda && agenda.length > 0 ? agenda : [];
  const color = accentColor || "hsl(220, 50%, 35%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displayAgenda.length === 0) return null;

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div className="relative max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <ClipboardList className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-xl md:text-3xl text-foreground">{l("agenda")}</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[140px] top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: colorWithAlpha(color, 0.2) }} />
          <div className="space-y-3">
            {displayAgenda.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-3 md:gap-4 p-3 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-sm transition-all">
                <div className="font-body text-xs md:text-sm font-semibold min-w-[80px] md:min-w-[120px] px-2 md:px-3 py-1.5 rounded-lg text-center" style={{ color, backgroundColor: colorWithAlpha(color, 0.1) }}>{item.time}</div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">{item.title}</p>
                  {item.speaker && <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><Mic className="w-3 h-3" /> {item.speaker}</p>}
                  {item.description && <p className="font-body text-xs text-muted-foreground mt-1">{item.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
