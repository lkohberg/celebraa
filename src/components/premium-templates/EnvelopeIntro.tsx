import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface EnvelopeIntroProps {
  names: string;
  onOpen: () => void;
  tapLabel?: string;
}

/* Celebraa logo as SVG seal motif – 4-point star with radiating accents */
const SealLogo = () => (
  <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
    {/* Outer decorative ring */}
    <circle cx="40" cy="40" r="36" stroke="hsl(30, 50%, 92%)" strokeWidth="1.2" opacity="0.5" />
    <circle cx="40" cy="40" r="32" stroke="hsl(30, 50%, 92%)" strokeWidth="0.6" opacity="0.3" />
    {/* 4-point star */}
    <path
      d="M40 12 C42 28, 52 38, 68 40 C52 42, 42 52, 40 68 C38 52, 28 42, 12 40 C28 38, 38 28, 40 12Z"
      fill="hsl(30, 50%, 92%)"
      opacity="0.9"
    />
    {/* Accent flares */}
    <path d="M26 18 C30 26, 26 30, 18 26" stroke="hsl(30, 50%, 92%)" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M54 18 C50 26, 54 30, 62 26" stroke="hsl(30, 50%, 92%)" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M26 62 C30 54, 26 50, 18 54" stroke="hsl(30, 50%, 92%)" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M54 62 C50 54, 54 50, 62 54" stroke="hsl(30, 50%, 92%)" strokeWidth="1" fill="none" opacity="0.5" />
    {/* Small dots */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <circle
        key={deg}
        cx={40 + 28 * Math.cos((deg * Math.PI) / 180)}
        cy={40 + 28 * Math.sin((deg * Math.PI) / 180)}
        r="1.2"
        fill="hsl(30, 50%, 92%)"
        opacity="0.4"
      />
    ))}
    {/* Center "C" letter */}
    <text
      x="40"
      y="46"
      textAnchor="middle"
      fontSize="16"
      fontFamily="'Great Vibes', cursive"
      fill="hsl(30, 50%, 92%)"
      opacity="0.95"
    >
      C
    </text>
  </svg>
);

const EnvelopeIntro = ({ names, onOpen, tapLabel }: EnvelopeIntroProps) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<"sealed" | "breaking" | "opening" | "done">("sealed");

  const initials = names.split("&").map((n) => n.trim()[0] || "").filter(Boolean);

  const handleClick = () => {
    if (phase !== "sealed") return;
    setPhase("breaking");
    // Seal breaks
    setTimeout(() => setPhase("opening"), 800);
    // Envelope opens & fade out
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(30 25% 95%) 0%, hsl(340 20% 95%) 50%, hsl(30 30% 93%) 100%)",
          }}
          onClick={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Tap hint */}
          <motion.p
            className="font-body text-[10px] tracking-[0.4em] uppercase mb-10 relative z-10"
            style={{ color: "hsl(340 20% 55%)" }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {tapLabel || t("event.tapToOpen")}
          </motion.p>

          {/* Envelope container */}
          <div className="relative w-[300px] h-[210px] sm:w-[360px] sm:h-[250px] md:w-[420px] md:h-[290px]">
            {/* Envelope body */}
            <motion.div
              className="absolute inset-0 rounded-sm overflow-hidden"
              style={{
                background: "linear-gradient(170deg, hsl(30 30% 94%) 0%, hsl(30 25% 90%) 100%)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
              }}
              animate={phase === "opening" ? { scaleY: 0.95, y: 40, opacity: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeIn" }}
            >
              {/* Inner fold lines */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 420 290" fill="none" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="210" y2="145" stroke="hsl(30, 20%, 82%)" strokeWidth="0.5" />
                  <line x1="420" y1="0" x2="210" y2="145" stroke="hsl(30, 20%, 82%)" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Initials at bottom center */}
              <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-10">
                {initials[0] && (
                  <span
                    className="text-[2.2rem] sm:text-[2.6rem] md:text-[3rem]"
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      color: "hsl(340 30% 45%)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    {initials[0]}
                  </span>
                )}
                {initials.length > 1 && (
                  <>
                    <span
                      className="text-sm mx-0.5"
                      style={{ color: "hsl(30 30% 55%)", fontFamily: "'Great Vibes', cursive" }}
                    >
                      &amp;
                    </span>
                    <span
                      className="text-[2.2rem] sm:text-[2.6rem] md:text-[3rem]"
                      style={{
                        fontFamily: "'Great Vibes', cursive",
                        color: "hsl(340 30% 45%)",
                        textShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      {initials[1]}
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Top flap */}
            <motion.div
              className="absolute top-0 left-0 w-full z-10"
              style={{ transformOrigin: "top center", perspective: 800 }}
              animate={
                phase === "opening"
                  ? { rotateX: -180, opacity: 0 }
                  : {}
              }
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <svg viewBox="0 0 420 170" className="w-full" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.06))" }}>
                <polygon points="0,0 210,170 420,0" fill="hsl(30, 28%, 91%)" />
                <line x1="0" y1="0" x2="210" y2="170" stroke="hsl(30, 20%, 85%)" strokeWidth="0.5" />
                <line x1="420" y1="0" x2="210" y2="170" stroke="hsl(30, 20%, 85%)" strokeWidth="0.5" />
              </svg>
            </motion.div>

            {/* Wax seal – centered on flap */}
            <motion.div
              className="absolute z-20"
              style={{
                width: 72,
                height: 72,
                top: "calc(50% - 20px)",
                left: "calc(50% - 36px)",
              }}
              animate={
                phase === "breaking"
                  ? {
                      scale: [1, 1.15, 0],
                      rotate: [0, 10, -180],
                      opacity: [1, 1, 0],
                    }
                  : phase === "sealed"
                  ? { scale: [1, 1.03, 1] }
                  : {}
              }
              transition={
                phase === "breaking"
                  ? { duration: 0.7, ease: "easeInOut" }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {/* Seal base */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 35% 35%, hsl(5 55% 48%), hsl(5 50% 35%))",
                  boxShadow: "0 4px 16px rgba(120, 30, 30, 0.35), inset 0 1px 2px rgba(255,255,255,0.15)",
                }}
              >
                <div className="w-[56px] h-[56px]">
                  <SealLogo />
                </div>
              </div>
            </motion.div>

            {/* Seal break particles */}
            <AnimatePresence>
              {phase === "breaking" && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full z-30"
                        style={{
                          width: 6 + Math.random() * 6,
                          height: 6 + Math.random() * 6,
                          background: `hsl(${5 + Math.random() * 10} ${45 + Math.random() * 15}% ${35 + Math.random() * 15}%)`,
                          top: "calc(50% - 20px)",
                          left: "50%",
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: Math.cos(angle) * (60 + Math.random() * 40),
                          y: Math.sin(angle) * (60 + Math.random() * 40),
                          opacity: 0,
                          scale: 0.3,
                        }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeIntro;
