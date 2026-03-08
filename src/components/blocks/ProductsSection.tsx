import { Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";

interface Product {
  name: string;
  description: string;
  imageUrl?: string;
}

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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Package className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("products")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayProducts.map((product, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="group bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300">
              {product.imageUrl && (
                <div className="relative h-44 overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
