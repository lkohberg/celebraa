import { Handshake, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface Sponsor {
  name: string;
  logoUrl?: string;
  url?: string;
}

const SponsorsSection = ({ sponsors, accentColor, isPreview = false, lang }: { sponsors?: Sponsor[]; accentColor?: string; isPreview?: boolean; lang?: EventLang }) => {
  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : [];
  const color = accentColor || "hsl(220, 50%, 35%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displaySponsors.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-card/80" />
      <div className="relative max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Handshake className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("sponsors")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {displaySponsors.map((sponsor, i) => (
            <motion.a key={i} href={isPreview ? "#" : sponsor.url || "#"} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05, y: -2 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-border hover:shadow-md transition-all aspect-square">
              {sponsor.logoUrl ? (
                <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-display text-lg font-bold text-muted-foreground">{sponsor.name}</span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
