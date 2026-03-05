import { Bus } from "lucide-react";
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
    <section className="py-20 bg-card">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <Bus className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Bus & Shuttle</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Wir organisieren Shuttles für euch!</p>
        </div>
        <div className="space-y-4">
          {displayRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border"
            >
              <div className="font-display text-lg font-bold min-w-[60px] text-center" style={{ color }}>{route.time}</div>
              <div className="flex-1">
                <p className="font-body text-sm text-foreground">{route.from} → {route.to}</p>
                {route.note && <p className="font-body text-xs text-muted-foreground mt-0.5">{route.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShuttleSection;
