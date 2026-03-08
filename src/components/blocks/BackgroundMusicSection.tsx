import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";

const BackgroundMusicSection = ({ accentColor }: { accentColor?: string }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-card to-card/50" />
      <div className="relative max-w-md mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3.5 border border-border/50 shadow-sm"
        >
          <Volume2 className="w-5 h-5" style={{ color }} />
          <span className="font-body text-sm text-foreground">♪ Hintergrundmusik aktiv</span>
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: color }}
                animate={{ height: [4, 8 + Math.random() * 8, 4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundMusicSection;
