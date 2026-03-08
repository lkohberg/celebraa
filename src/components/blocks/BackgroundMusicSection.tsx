import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";

const BackgroundMusicSection = ({ accentColor, lang, isDemo = false, musicUrl }: { accentColor?: string; lang?: EventLang; isDemo?: boolean; musicUrl?: string }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";
  const label = lang ? getEventLabel(lang, "bgMusicActive") : "♪ Hintergrundmusik aktiv";
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoStarted = useRef(false);

  const src = musicUrl || "/demo.mp3";

  const startMusic = useCallback(() => {
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
    if (autoStarted.current) return;
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
  }, [startMusic]);

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-card to-card/50" />
      <div className="relative max-w-md mx-auto px-4 text-center">
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
      </div>
    </section>
  );
};

export default BackgroundMusicSection;
