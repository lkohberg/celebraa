import { Paintbrush } from "lucide-react";

const CustomIllustrationSection = ({ imageUrl, accentColor }: { imageUrl?: string; accentColor?: string }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <Paintbrush className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Unsere Location</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Individuell illustriert mit KI</p>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          {imageUrl ? (
            <img src={imageUrl} alt="Custom Illustration" className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <Paintbrush className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="font-body text-sm text-muted-foreground">KI-Illustration wird nach Bestellung erstellt</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomIllustrationSection;
