import { Bus, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ShuttleRoute {
  time: string;
  from: string;
  to: string;
  note?: string;
}

const demoRoutes: ShuttleRoute[] = [
  { time: "14:30", from: "Hauptbahnhof", to: "Kirche St. Peter", note: "Abfahrt pünktlich" },
  { time: "16:00", from: "Kirche St. Peter", to: "Schloss Mirabell" },
  { time: "00:00", from: "Schloss Mirabell", to: "Hauptbahnhof", note: "Letzte Fahrt" },
];

const ShuttleSection = ({ routes, accentColor }: { routes?: ShuttleRoute[]; accentColor?: string }) => {
  const displayRoutes = routes && routes.length > 0 ? routes : demoRoutes;
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-card/80" />

      <div className="relative max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Bus className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Bus & Shuttle</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">Wir organisieren Shuttles für euch!</p>
        </motion.div>

        <div className="space-y-4">
          {displayRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-sm transition-shadow"
            >
              <div className="font-display text-lg font-bold min-w-[60px] text-center px-3 py-2 rounded-lg" style={{ color, backgroundColor: `${color}10` }}>{route.time}</div>
              <div className="flex-1">
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <span className="font-medium">{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{route.to}</span>
                </p>
                {route.note && <p className="font-body text-xs text-muted-foreground mt-1 italic">{route.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShuttleSection;
