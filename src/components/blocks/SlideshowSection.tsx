import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

interface SlideshowSectionProps {
  accentColor?: string;
  lang?: EventLang;
  blockConfig?: any;
}

const SlideshowSection = ({ accentColor = "hsl(150, 18%, 38%)", lang, blockConfig }: SlideshowSectionProps) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const urls: string[] = blockConfig?.slideshow_urls || [];
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setCurrent(i => (i + 1) % urls.length), [urls.length]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + urls.length) % urls.length), [urls.length]);

  if (!urls.length) return null;

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  return (
    <>
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: "hsl(30, 30%, 98%)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
              {el?.slideshow || t("event.slideshow")}
            </h2>
            <div className="w-12 h-px mx-auto" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
          </div>

          <div className="relative" ref={containerRef}>
            <div className="overflow-hidden rounded-2xl shadow-md aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  onClick={() => setLightboxIndex(current)}
                >
                  <img
                    src={urls[current]}
                    alt=""
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {urls.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/70 backdrop-blur-sm border border-border/30 flex items-center justify-center shadow-sm hover:bg-card transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/70 backdrop-blur-sm border border-border/30 flex items-center justify-center shadow-sm hover:bg-card transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </>
            )}

            {urls.length > 1 && (
              <div className="flex justify-center gap-2 mt-5">
                {urls.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === current ? accentColor : "hsl(30, 15%, 80%)",
                      transform: i === current ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {urls.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + urls.length) % urls.length); }}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % urls.length); }}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              src={urls[lightboxIndex]}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[92vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-body">
              {lightboxIndex + 1} / {urls.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SlideshowSection;
