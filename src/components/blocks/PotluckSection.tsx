import { useState } from "react";
import { ShoppingBasket, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PotluckItem {
  name: string;
  claimedBy?: string;
}

const demoItems: PotluckItem[] = [
  { name: "Kartoffelsalat", claimedBy: "Lisa" },
  { name: "Brownies" },
  { name: "Chips & Dips" },
  { name: "Fruchtbowle", claimedBy: "Max" },
  { name: "Brot & Aufstriche" },
];

const PotluckSection = ({ items, accentColor, isPreview = false }: { items?: PotluckItem[]; accentColor?: string; isPreview?: boolean }) => {
  const [displayItems, setDisplayItems] = useState(items && items.length > 0 ? items : demoItems);
  const color = accentColor || "hsl(340, 65%, 50%)";

  return (
    <section className="py-20 bg-card">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <ShoppingBasket className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Mitbringliste</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Wer bringt was mit?</p>
        </div>
        <div className="space-y-2">
          {displayItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                {item.claimedBy ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 rounded border-2 border-border" />
                )}
                <span className={`font-body text-sm ${item.claimedBy ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.name}
                </span>
              </div>
              {item.claimedBy ? (
                <span className="font-body text-xs text-muted-foreground">{item.claimedBy}</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="font-body text-xs h-7"
                  disabled={isPreview}
                  onClick={() => {
                    if (isPreview) return;
                    const updated = [...displayItems];
                    updated[i] = { ...updated[i], claimedBy: "Du" };
                    setDisplayItems(updated);
                  }}
                >
                  Ich bringe mit!
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
