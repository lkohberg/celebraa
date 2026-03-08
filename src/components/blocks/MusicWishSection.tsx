import { useState } from "react";
import { Music2, Send, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitMusicWish } from "@/hooks/useEvents";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />

      <div className="relative max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Music2 className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Wunschmusik</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">Welcher Song darf auf keinen Fall fehlen?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Song + Künstler eingeben..."
              value={song}
              onChange={(e) => setSong(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="font-body"
              disabled={isPreview}
            />
            <Button onClick={handleSubmit} disabled={isPreview || submitWish.isPending || !song.trim()} className="shrink-0">
              {submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MusicWishSection;
