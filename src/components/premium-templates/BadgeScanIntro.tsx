import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface BadgeScanIntroProps {
  title: string;
  onOpen: () => void;
  tapLabel?: string;
  accentColor?: string;
}

const BadgeScanIntro = ({ title, onOpen, tapLabel, accentColor }: BadgeScanIntroProps) => {
  const { t } = useTranslation();
  // phases: entering → idle → scanning → verified → done
  const [phase, setPhase] = useState<"entering" | "idle" | "scanning" | "verified" | "done">("entering");
  const accent = accentColor || "hsl(220, 50%, 45%)";
  const scanRed = "hsl(0, 75%, 55%)";

  // Badge slides in on mount
  useEffect(() => {
    const timer = setTimeout(() => setPhase("idle"), 800);
    return () => clearTimeout(timer);
  }, []);

  const qrPattern = useMemo(() => Array.from({ length: 25 }, () => Math.random() > 0.4), []);
  const barWidths = useMemo(() => Array.from({ length: 30 }, () => 2 + Math.random() * 3), []);
  const barHeights = useMemo(() => Array.from({ length: 30 }, () => 16 + Math.random() * 16), []);

  // Typewriter text for "ACCESS GRANTED"
  const grantedText = "ACCESS GRANTED";
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (phase !== "verified") {
      setTypedChars(0);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedChars(i);
      if (i >= grantedText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("scanning");
    setTimeout(() => setPhase("verified"), 1600);
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 3200);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="badge-intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(220 20% 10%) 0%, hsl(220 25% 15%) 50%, hsl(220 20% 12%) 100%)",
          }}
          onClick={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(hsl(220, 50%, 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(220, 50%, 50%) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Tap hint */}
          {phase === "idle" && (
            <motion.p
              className="font-body text-[10px] tracking-[0.5em] uppercase mb-10 relative z-10"
              style={{ color: accent }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {tapLabel || t("event.tapToOpen")}
            </motion.p>
          )}

          {/* Badge card – slides in from bottom */}
          <motion.div
            className="relative z-10"
            style={{ width: 240, height: 320 }}
            initial={{ y: 400, opacity: 0 }}
            animate={
              phase === "entering"
                ? { y: 400, opacity: 0 }
                : phase === "verified"
                ? { y: 0, opacity: 1, scale: [1, 1.03, 1] }
                : { y: 0, opacity: 1 }
            }
            transition={
              phase === "entering"
                ? { duration: 0 }
                : { duration: 0.7, ease: [0.2, 0.8, 0.3, 1] }
            }
          >
            {/* Card */}
            <div
              className="w-full h-full rounded-xl relative overflow-hidden"
              style={{
                background: "linear-gradient(170deg, hsl(220 15% 18%) 0%, hsl(220 20% 14%) 100%)",
                border: `1px solid hsl(220 30% 25%)`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            >
              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ background: accent }} />

              {/* Logo area */}
              <div className="flex justify-center mt-8 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                    boxShadow: `0 4px 20px ${accent}40`,
                  }}
                >
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <path
                      d="M20 6 C21 14, 26 19, 34 20 C26 21, 21 26, 20 34 C19 26, 14 21, 6 20 C14 19, 19 14, 20 6Z"
                      fill="white"
                      opacity="0.9"
                    />
                  </svg>
                </div>
              </div>

              {/* Event title */}
              <div className="text-center px-6">
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-2">Event Access</p>
                <p className="text-white text-base font-semibold tracking-wide leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {title}
                </p>
              </div>

              {/* QR pattern */}
              <div className="flex justify-center mt-6">
                <div className="grid grid-cols-5 gap-1 opacity-20">
                  {qrPattern.map((filled, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: filled ? "white" : "transparent" }} />
                  ))}
                </div>
              </div>

              {/* Bar code */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-[2px] items-end justify-center opacity-15">
                {barWidths.map((w, i) => (
                  <div key={i} className="bg-white" style={{ width: w, height: barHeights[i] }} />
                ))}
              </div>

              {/* RED scan line over barcode only */}
              <AnimatePresence>
                {phase === "scanning" && (
                  <motion.div
                    className="absolute left-6 right-6 h-[2px] z-20"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${scanRed}, transparent)`,
                      boxShadow: `0 0 12px ${scanRed}80, 0 0 30px ${scanRed}40`,
                    }}
                    initial={{ bottom: "24px" }}
                    animate={{ bottom: ["56px", "24px", "56px", "24px"] }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Green border flash on verified */}
              <AnimatePresence>
                {phase === "verified" && (
                  <motion.div
                    className="absolute inset-0 rounded-xl z-15 pointer-events-none"
                    style={{ border: "2px solid hsl(140, 70%, 45%)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 1, 0.4] }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* ACCESS GRANTED overlay */}
              <AnimatePresence>
                {phase === "verified" && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center z-20"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Checkmark */}
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: "hsl(140, 70%, 45%)",
                        boxShadow: "0 0 30px hsla(140, 70%, 45%, 0.5)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <motion.svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        />
                      </motion.svg>
                    </motion.div>

                    {/* Typewriter text */}
                    <p
                      className="text-sm tracking-[0.4em] uppercase font-mono"
                      style={{ color: "hsl(140, 70%, 55%)", textShadow: "0 0 10px hsla(140, 70%, 45%, 0.4)" }}
                    >
                      {grantedText.slice(0, typedChars)}
                      <span className="animate-pulse">|</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Holographic shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 60%, transparent 80%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Glow behind card */}
            <motion.div
              className="absolute -inset-4 rounded-2xl -z-10"
              style={{
                background: phase === "verified"
                  ? `radial-gradient(ellipse at center, hsla(140, 70%, 45%, 0.15), transparent 70%)`
                  : `radial-gradient(ellipse at center, ${accent}15, transparent 70%)`,
              }}
              animate={
                phase === "scanning"
                  ? { opacity: [0.5, 1, 0.5] }
                  : phase === "verified"
                  ? { opacity: 1 }
                  : { opacity: 0.3 }
              }
              transition={{ duration: 1, repeat: phase === "scanning" ? Infinity : 0 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeScanIntro;
