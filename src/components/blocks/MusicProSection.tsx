import { useState } from "react";
import { Music, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MusicProSection = ({ accentColor, isPreview = false }: { accentColor?: string; isPreview?: boolean }) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const color = accentColor || "hsl(38, 65%, 50%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <Music className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Musikwünsche</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Welcher Song bringt dich auf die Tanzfläche?</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <div>
            <Input
              placeholder="Song-Titel"
              value={song}
              onChange={(e) => !isPreview && setSong(e.target.value)}
              className="font-body"
              disabled={isPreview}
            />
          </div>
          <div>
            <Input
              placeholder="Künstler / Band"
              value={artist}
              onChange={(e) => !isPreview && setArtist(e.target.value)}
              className="font-body"
              disabled={isPreview}
            />
          </div>
          <Button className="w-full font-body" disabled={isPreview}>
            <Send className="w-4 h-4 mr-2" /> Songwunsch senden
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MusicProSection;
