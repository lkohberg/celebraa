import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const demoImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
];

const SlideshowSection = ({ images, accentColor }: { images?: string[]; accentColor?: string }) => {
  const displayImages = images && images.length > 0 ? images : demoImages;
  const [current, setCurrent] = useState(0);
  const color = accentColor || "hsl(38, 65%, 50%)";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  return (
    <section className="py-20 bg-card">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <Camera className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Unsere Momente</h2>
        </div>
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={displayImages[current]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlideshowSection;
