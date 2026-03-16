import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Flag } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BackgroundMusicSection = ({ accentColor, lang, isDemo = false, musicUrl, blockConfig, eventId }: { accentColor?: string; lang?: EventLang; isDemo?: boolean; musicUrl?: string; blockConfig?: any; eventId?: string }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";
  const label = lang ? getEventLabel(lang, "bgMusicActive") : "♪ Hintergrundmusik aktiv";
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoStarted = useRef(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportEmail, setReportEmail] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if music is disabled due to copyright report
  const isMusicDisabled = blockConfig?.music_disabled === true;

  // Use admin-uploaded music if available, then user-uploaded
  const src = isMusicDisabled ? null : (blockConfig?.music_url || musicUrl || (isDemo ? "/demo.mp3" : null));

  const startMusic = useCallback(() => {
    if (!src) return;
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [src]);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlaying(false);
  }, []);

  // Auto-start on first user interaction
  useEffect(() => {
    if (autoStarted.current || !src) return;
    const handleInteraction = () => {
      if (!autoStarted.current) {
        autoStarted.current = true;
        startMusic();
      }
    };
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });
    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [startMusic, src]);

  const handleReport = async () => {
    if (!eventId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("copyright_reports" as any).insert({
        event_id: eventId,
        reporter_email: reportEmail || null,
        reason: reportReason || null,
      });
      if (error) throw error;
      stopMusic();
      toast.success("Meldung wurde eingereicht. Die Musik wird überprüft.");
      setReportOpen(false);
      setReportEmail("");
      setReportReason("");
    } catch {
      toast.error("Fehler beim Einreichen der Meldung.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isMusicDisabled || (!src && !isDemo)) return null;

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-card to-card/50" />
      <div className="relative max-w-md mx-auto px-4 text-center space-y-2">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => playing ? stopMusic() : startMusic()}
          className="inline-flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3.5 border border-border/50 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        >
          {playing ? (
            <Volume2 className="w-5 h-5" style={{ color }} />
          ) : (
            <VolumeX className="w-5 h-5" style={{ color }} />
          )}
          <span className="font-body text-sm text-foreground">{label}</span>
          <div className="flex gap-0.5 items-end h-4">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: color }}
                animate={playing ? { height: [4, 8 + Math.random() * 8, 4] } : { height: 4 }}
                transition={{ duration: 0.8, repeat: playing ? Infinity : 0, delay: i * 0.12 }}
              />
            ))}
          </div>
        </motion.button>

        {/* Copyright report link */}
        {!isDemo && eventId && (
          <button
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-1.5 text-muted-foreground/50 hover:text-muted-foreground text-[10px] font-body transition-colors"
          >
            <Flag className="w-3 h-3" />
            Urheberrechtsverletzung melden
          </button>
        )}
      </div>

      {/* Report dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Urheberrechtsverletzung melden</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Wenn du glaubst, dass die verwendete Musik urheberrechtlich geschützt ist, kannst du hier eine Meldung einreichen. Die Musik wird sofort deaktiviert und überprüft.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Deine E-Mail (optional)"
              value={reportEmail}
              onChange={(e) => setReportEmail(e.target.value)}
              className="font-body"
            />
            <Textarea
              placeholder="Beschreibe die Verletzung..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="font-body"
              rows={3}
            />
            <Button onClick={handleReport} disabled={submitting} className="w-full font-body">
              {submitting ? "Wird gesendet..." : "Meldung einreichen"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BackgroundMusicSection;
