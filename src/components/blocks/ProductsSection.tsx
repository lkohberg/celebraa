import { useState, useEffect } from "react";
import { Package, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface Product {
  name: string;
  description: string;
  images?: string[];
  imageUrl?: string; // legacy
}

const ProductSlideshow = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative h-52 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(prev => (prev - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(prev => (prev + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}>
                <div className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ProductsSection = ({ products, accentColor, lang }: { products?: Product[]; accentColor?: string; lang?: EventLang }) => {
  const displayProducts = products && products.length > 0 ? products : [];
  const color = accentColor || "hsl(220, 50%, 35%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="relative max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Package className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("products")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className={`grid gap-6 ${displayProducts.length === 1 ? "max-w-sm mx-auto" : displayProducts.length === 2 ? "grid-cols-2 max-w-2xl mx-auto" : "grid-cols-2 lg:grid-cols-3"} justify-items-center`}>
          {displayProducts.map((product, i) => {
            const allImages = product.images && product.images.length > 0
              ? product.images
              : product.imageUrl ? [product.imageUrl] : [];

            return (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="group bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300">
                {allImages.length > 0 && (
                  <ProductSlideshow images={allImages} name={product.name} />
                )}
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
