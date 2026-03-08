import { useState, useMemo } from "react";
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
  const [phase, setPhase] = useState<"idle" | "scanning" | "verified" | "done">("idle");
  const accent = accentColor || "hsl(220, 50%, 45%)";

  // Pre-compute random values so they don't change on re-render
  const qrPattern = useMemo(() => Array.from({ length: 25 }, () => Math.random() > 0.4), []);
  const barWidths = useMemo(() => Array.from({ length: 30 }, () => 2 + Math.random() * 3), []);
  const barHeights = useMemo(() => Array.from({ length: 30 }, () => 16 + Math.random() * 16), []);

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("scanning");
    setTimeout(() => setPhase("verified"), 1400);
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2600);
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
          <motion.p
            className="font-body text-[10px] tracking-[0.5em] uppercase mb-10 relative z-10"
            style={{ color: `${accent}` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {tapLabel || t("event.tapToOpen")}
          </motion.p>

          {/* Badge card */}
          <motion.div
            className="relative z-10"
            style={{ width: 240, height: 320 }}
            animate={
              phase === "verified"
                ? { scale: [1, 1.05, 1], y: [0, -10, 0] }
                : {}
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
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
                <p
                  className="text-white text-base font-semibold tracking-wide leading-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {title}
                </p>
              </div>

              {/* QR-code-style block pattern */}
              <div className="flex justify-center mt-6">
                <div className="grid grid-cols-5 gap-1 opacity-20">
                  {qrPattern.map((filled, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: filled ? "white" : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom bar code lines */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-[2px] items-end justify-center opacity-15">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white"
                    style={{
                      width: 2 + Math.random() * 3,
                      height: 16 + Math.random() * 16,
                    }}
                  />
                ))}
              </div>

              {/* Scanning line */}
              <AnimatePresence>
                {phase === "scanning" && (
                  <motion.div
                    className="absolute left-0 right-0 h-[2px] z-20"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                      boxShadow: `0 0 20px ${accent}80, 0 0 40px ${accent}40`,
                    }}
                    initial={{ top: "10%" }}
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Verified checkmark overlay */}
              <AnimatePresence>
                {phase === "verified" && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    style={{ background: `${accent}20` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: accent,
                        boxShadow: `0 0 40px ${accent}60`,
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        className="w-10 h-10"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        />
                      </motion.svg>
                    </motion.div>
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

            {/* Glow effect behind card */}
            <motion.div
              className="absolute -inset-4 rounded-2xl -z-10"
              style={{
                background: `radial-gradient(ellipse at center, ${accent}15, transparent 70%)`,
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
