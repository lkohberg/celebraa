import { Volume2 } from "lucide-react";

const BackgroundMusicSection = ({ accentColor }: { accentColor?: string }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-12 bg-card">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 bg-background rounded-full px-6 py-3 border border-border">
          <Volume2 className="w-5 h-5" style={{ color }} />
          <span className="font-body text-sm text-foreground">♪ Hintergrundmusik aktiv</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-1 rounded-full animate-pulse" style={{ height: `${8 + Math.random() * 12}px`, backgroundColor: color, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackgroundMusicSection;
