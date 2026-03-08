import { useState } from "react";
import { Music2, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitMusicWish } from "@/hooks/useEvents";
import { toast } from "sonner";

const MusicWishSection = ({ accentColor, eventId, isPreview = false }: { accentColor?: string; eventId?: string; isPreview?: boolean }) => {
  const [song, setSong] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitWish = useSubmitMusicWish();
  const color = accentColor || "hsl(340, 65%, 50%)";

  const handleSubmit = async () => {
    if (isPreview || !eventId || !song.trim()) return;
    try {
      await submitWish.mutateAsync({ event_id: eventId, song_title: song.trim() });
      toast.success("Songwunsch gespeichert! 🎵");
      setSong("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error("Fehler beim Speichern");
    }
  };

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
            onChange={(e) => setSong(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="font-body"
            disabled={isPreview}
          />
          <Button onClick={handleSubmit} disabled={isPreview || submitWish.isPending || !song.trim()}>
            {submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MusicWishSection;
