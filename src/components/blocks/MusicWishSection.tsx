import { useState } from "react";
import { Music2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MusicWishSection = ({ accentColor, isPreview = false }: { accentColor?: string; isPreview?: boolean }) => {
  const [song, setSong] = useState("");
  const color = accentColor || "hsl(340, 65%, 50%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-10">
          <Music2 className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Wunschmusik</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Welcher Song darf auf keinen Fall fehlen?</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Song + Künstler eingeben..."
            value={song}
            onChange={(e) => !isPreview && setSong(e.target.value)}
            className="font-body"
            disabled={isPreview}
          />
          <Button disabled={isPreview}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MusicWishSection;
