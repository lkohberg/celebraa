import { Handshake } from "lucide-react";
import { motion } from "framer-motion";

interface Sponsor {
  name: string;
  logoUrl?: string;
  url?: string;
}

const demoSponsors: Sponsor[] = [
  { name: "TechCorp", url: "#" },
  { name: "InnovateLab", url: "#" },
  { name: "FutureVision", url: "#" },
  { name: "CloudBase", url: "#" },
];

const SponsorsSection = ({ sponsors, accentColor, isPreview = false }: { sponsors?: Sponsor[]; accentColor?: string; isPreview?: boolean }) => {
  const displaySponsors = sponsors && sponsors.length > 0 ? sponsors : demoSponsors;
  const color = accentColor || "hsl(220, 50%, 35%)";

  return (
    <section className="py-20 bg-card">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Handshake className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Unsere Sponsoren</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displaySponsors.map((sponsor, i) => (
            <motion.a
              key={i}
              href={isPreview ? "#" : sponsor.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-center p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors aspect-square"
            >
              {sponsor.logoUrl ? (
                <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-display text-lg font-bold text-muted-foreground">{sponsor.name}</span>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
