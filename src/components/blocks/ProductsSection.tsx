import { Package } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  name: string;
  description: string;
  imageUrl?: string;
}

const demoProducts: Product[] = [
  { name: "Innovation Suite", description: "Unsere neueste Plattform für digitale Transformation.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" },
  { name: "Cloud Analytics", description: "Echtzeit-Datenanalyse für Ihr Unternehmen.", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" },
  { name: "SecureConnect", description: "Enterprise-Sicherheit der nächsten Generation.", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop" },
];

const ProductsSection = ({ products, accentColor }: { products?: Product[]; accentColor?: string }) => {
  const displayProducts = products && products.length > 0 ? products : demoProducts;
  const color = accentColor || "hsl(220, 50%, 35%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Package className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Produkte</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {displayProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl overflow-hidden border border-border"
            >
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
