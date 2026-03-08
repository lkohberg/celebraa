import { useState } from "react";
import { Music, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitMusicWish } from "@/hooks/useEvents";
import { toast } from "sonner";

const MusicProSection = ({ accentColor, eventId, isPreview = false }: { accentColor?: string; eventId?: string; isPreview?: boolean }) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitWish = useSubmitMusicWish();
  const color = accentColor || "hsl(38, 65%, 50%)";

  const handleSubmit = async () => {
    if (isPreview || !eventId || !song.trim()) return;
    try {
      await submitWish.mutateAsync({
        event_id: eventId,
        song_title: song.trim(),
        artist: artist.trim() || undefined,
        guest_name: guestName.trim() || undefined,
      });
      toast.success("Songwunsch gespeichert! 🎵");
      setSong("");
      setArtist("");
      setGuestName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error("Fehler beim Speichern");
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <Music className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Musikwünsche</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Welcher Song bringt dich auf die Tanzfläche?</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <Input
            placeholder="Dein Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="font-body"
            disabled={isPreview}
          />
          <Input
            placeholder="Song-Titel"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className="font-body"
            disabled={isPreview}
          />
          <Input
            placeholder="Künstler / Band"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="font-body"
            disabled={isPreview}
          />
          <Button className="w-full font-body" onClick={handleSubmit} disabled={isPreview || submitWish.isPending || !song.trim()}>
            {submitted ? <><Check className="w-4 h-4 mr-2" /> Gespeichert!</> : <><Send className="w-4 h-4 mr-2" /> Songwunsch senden</>}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MusicProSection;
