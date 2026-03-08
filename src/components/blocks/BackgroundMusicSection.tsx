import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";

const BackgroundMusicSection = ({ accentColor, lang, isDemo = false }: { accentColor?: string; lang?: EventLang; isDemo?: boolean }) => {
  const color = accentColor || "hsl(38, 65%, 50%)";
  const label = lang ? getEventLabel(lang, "bgMusicActive") : "♪ Hintergrundmusik aktiv";
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Simple ambient melody using Web Audio API for demo
  const startMusic = () => {
    if (audioCtxRef.current) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25, 440.00, 349.23];
    let noteIdx = 0;

    const playNote = () => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = notes[noteIdx % notes.length];

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.1);
      noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.9);

      osc.connect(noteGain);
      noteGain.connect(gain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
      noteIdx++;
    };

    playNote();
    intervalRef.current = window.setInterval(playNote, 1000);
    setPlaying(true);
  };

  const stopMusic = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    gainRef.current = null;
    intervalRef.current = null;
    setPlaying(false);
  };

  useEffect(() => {
    return () => { stopMusic(); };
  }, []);

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
            <VolumeX className="w-5 h-5" style={{ color }} />
          ) : (
            <Volume2 className="w-5 h-5" style={{ color }} />
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
