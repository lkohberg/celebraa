import { useState } from "react";
import { ShoppingBasket, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PotluckItem {
  name?: string;
  item?: string;
  claimedBy?: string;
  assignedTo?: string;
}

const demoItems: PotluckItem[] = [
  { name: "Kartoffelsalat", claimedBy: "Lisa" },
  { name: "Brownies" },
  { name: "Chips & Dips" },
  { name: "Fruchtbowle", claimedBy: "Max" },
  { name: "Brot & Aufstriche" },
];

const PotluckSection = ({ items, accentColor, isPreview = false }: { items?: PotluckItem[]; accentColor?: string; isPreview?: boolean }) => {
  const normalized = (items && items.length > 0 ? items : demoItems).map(i => ({
    name: i.name || i.item || "",
    claimedBy: i.claimedBy || i.assignedTo || "",
  }));
  const [displayItems, setDisplayItems] = useState(normalized);
  const color = accentColor || "hsl(340, 65%, 50%)";

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/80 to-card" />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <ShoppingBasket className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Mitbringliste</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">Wer bringt was mit?</p>
        </motion.div>

        <div className="space-y-2.5">
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                {item.claimedBy ? (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-border" />
                )}
                <span className={`font-body text-sm ${item.claimedBy ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                  {item.name}
                </span>
              </div>
              {item.claimedBy ? (
                <span className="font-body text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">{item.claimedBy}</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="font-body text-xs h-8 rounded-lg"
                  disabled={isPreview}
                  onClick={() => {
                    if (isPreview) return;
                    const updated = [...displayItems];
                    updated[i] = { ...updated[i], claimedBy: "Du" };
                    setDisplayItems(updated);
                  }}
                >
                  ✋ Ich bringe mit!
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PotluckSection;
