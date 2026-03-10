import { Paintbrush, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

const CustomIllustrationSection = ({ imageUrl, accentColor, lang, blockConfig }: { imageUrl?: string; accentColor?: string; lang?: EventLang; blockConfig?: any }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);
  // Use admin-uploaded illustration if available
  const finalImageUrl = blockConfig?.illustration_url || imageUrl;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="relative max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Paintbrush className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("illustration")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">{l("illustrationSub")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-xl">
          {finalImageUrl ? (
            <img src={finalImageUrl} alt="Custom Illustration" className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-gradient-to-br from-secondary via-card to-secondary flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
              <div className="text-center relative">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(color, 0.1) }}>
                  <Paintbrush className="w-8 h-8" style={{ color, opacity: 0.5 }} />
                </div>
                <p className="font-body text-sm text-muted-foreground">{l("illustrationPlaceholder")}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomIllustrationSection;
