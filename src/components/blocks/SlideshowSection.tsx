import { useState, useEffect } from "react";
import { Camera, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

const demoImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
];

const SlideshowSection = ({ images, accentColor, lang }: { images?: string[]; accentColor?: string; lang?: EventLang }) => {
  const displayImages = images && images.length > 0 ? images : demoImages;
  const [current, setCurrent] = useState(0);
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
      <div className="relative max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Camera className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("slideshow")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
          <AnimatePresence mode="wait">
            <motion.img key={current} src={displayImages[current]} alt="" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayImages.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className="transition-all duration-300">
                <div className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlideshowSection;
