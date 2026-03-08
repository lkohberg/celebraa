import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface GiftBoxIntroProps {
  title: string;
  onOpen: () => void;
  tapLabel?: string;
  accentColor?: string;
}

const GiftBoxIntro = ({ title, onOpen, tapLabel, accentColor }: GiftBoxIntroProps) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"closed" | "shaking" | "opening" | "done">("closed");
  const accent = accentColor || "hsl(340, 65%, 50%)";

  const handleClick = () => {
    if (phase !== "closed") return;
    setPhase("shaking");
    setTimeout(() => setPhase("opening"), 900);
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2400);
  };

  const confettiColors = ["#FF6B9D", "#C44DFF", "#FFD93D", "#6BCB77", "#4D96FF", "#FF8A65", "#E040FB", "#FFAB40"];

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="giftbox-intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(340 30% 96%) 0%, hsl(280 25% 95%) 50%, hsl(340 35% 94%) 100%)",
          }}
          onClick={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  background: accent,
                  opacity: 0.15,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.5, 1] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>

          {/* Tap hint */}
          <motion.p
            className="font-body text-[10px] tracking-[0.4em] uppercase mb-10 relative z-10"
            style={{ color: accent }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {tapLabel || t("event.tapToOpen")}
          </motion.p>

          {/* Gift box container */}
          <motion.div
            className="relative z-10"
            animate={
              phase === "shaking"
                ? { rotate: [0, -3, 3, -3, 3, -2, 2, 0], scale: [1, 1.02, 1.02, 1.02, 1.02, 1.01, 1.01, 1] }
                : {}
            }
            transition={phase === "shaking" ? { duration: 0.7, ease: "easeInOut" } : {}}
          >
            {/* Box lid */}
            <motion.div
              className="relative z-20 mx-auto"
              style={{ width: 180, height: 40 }}
              animate={
                phase === "opening"
                  ? { y: -120, rotateZ: -15, opacity: 0 }
                  : {}
              }
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Lid shape */}
              <div
                className="w-full h-full rounded-t-md relative"
                style={{
                  background: `linear-gradient(180deg, ${accent}, ${accent}dd)`,
                  boxShadow: "0 -2px 12px rgba(0,0,0,0.1)",
                }}
              >
                {/* Ribbon knot on top */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-0">
                  <div
                    className="w-5 h-5 rounded-full border-2"
                    style={{ borderColor: "hsl(43, 70%, 60%)", background: "transparent" }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 -ml-2"
                    style={{ borderColor: "hsl(43, 70%, 60%)", background: "transparent" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Box body */}
            <motion.div
              className="relative mx-auto"
              style={{ width: 160, height: 130, marginTop: -2 }}
              animate={
                phase === "opening"
                  ? { y: 60, opacity: 0, scale: 0.9 }
                  : {}
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeIn" }}
            >
              <div
                className="w-full h-full rounded-b-md relative overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${accent}ee, ${accent})`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                }}
              >
                {/* Vertical ribbon */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-full"
                  style={{ background: "hsl(43, 70%, 60%)", opacity: 0.7 }}
                />
                {/* Horizontal ribbon */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-5"
                  style={{ background: "hsl(43, 70%, 60%)", opacity: 0.7 }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Title below box */}
            <motion.p
              className="text-center mt-6 text-sm tracking-widest uppercase font-medium"
              style={{ color: accent, opacity: 0.7 }}
              animate={phase === "opening" ? { opacity: 0 } : {}}
            >
              {title}
            </motion.p>
          </motion.div>

          {/* Confetti explosion on opening */}
          <AnimatePresence>
            {(phase === "opening") && (
              <>
                {Array.from({ length: 30 }).map((_, i) => {
                  const angle = (i / 30) * Math.PI * 2;
                  const dist = 80 + Math.random() * 160;
                  const color = confettiColors[i % confettiColors.length];
                  const size = 4 + Math.random() * 8;
                  return (
                    <motion.div
                      key={`confetti-${i}`}
                      className="absolute z-30 rounded-sm"
                      style={{
                        width: size,
                        height: size * (0.5 + Math.random()),
                        backgroundColor: color,
                        top: "50%",
                        left: "50%",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist - 40,
                        opacity: 0,
                        scale: 0.2,
                        rotate: 180 + Math.random() * 360,
                      }}
                      transition={{ duration: 0.8 + Math.random() * 0.4, delay: 0.1 + i * 0.015, ease: "easeOut" }}
                    />
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GiftBoxIntro;
