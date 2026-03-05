import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

interface MenuItem {
  course: string;
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
    <section className="py-20 bg-card">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <UtensilsCrossed className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Menü</h2>
        </div>
        <div className="space-y-8">
          {displayMenu.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{item.course}</p>
              <h3 className="font-display text-xl text-foreground mb-1">{item.name}</h3>
              {item.description && (
                <p className="font-body text-sm text-muted-foreground italic">{item.description}</p>
              )}
              {i < displayMenu.length - 1 && (
                <div className="w-8 h-px mx-auto mt-6" style={{ backgroundColor: color }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodMenuSection;
