import { UtensilsCrossed, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  course?: string;
  name: string;
  description?: string;
}

const demoMenu: MenuItem[] = [
  { course: "Vorspeise", name: "Carpaccio vom Rind", description: "mit Rucola, Parmesan und Trüffelöl" },
  { course: "Hauptgang", name: "Rosa gebratenes Filet", description: "mit Süßkartoffelpüree und Saisongemüse" },
  { course: "Dessert", name: "Panna Cotta", description: "mit Beerenspiegel und frischer Minze" },
];

const FoodMenuSection = ({ menu, accentColor }: { menu?: MenuItem[]; accentColor?: string }) => {
  const displayMenu = menu && menu.length > 0 ? menu : demoMenu;
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Elegant patterned background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/80 to-card" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <UtensilsCrossed className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Menü</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-16 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-16 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 p-8 md:p-12 shadow-sm">
          <div className="space-y-10">
            {displayMenu.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                {item.course && (
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color }}>{item.course}</p>
                )}
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-1.5">{item.name}</h3>
                {item.description && (
                  <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
                )}
                {i < displayMenu.length - 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <div className="w-6 h-px" style={{ backgroundColor: color, opacity: 0.2 }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.2 }} />
                    <div className="w-6 h-px" style={{ backgroundColor: color, opacity: 0.2 }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodMenuSection;
