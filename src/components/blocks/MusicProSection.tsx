import { useState } from "react";
import { Music, Send, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitMusicWish } from "@/hooks/useEvents";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Music className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Musikwünsche</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">Welcher Song bringt dich auf die Tanzfläche?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm space-y-4"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default MusicProSection;
