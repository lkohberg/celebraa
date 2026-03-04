import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";

interface EnvelopeIntroProps {
  names: string; // e.g. "Lisa & Thomas"
  onOpen: () => void;
}

const EnvelopeIntro = ({ names, onOpen }: EnvelopeIntroProps) => {
  const { t } = useTranslation();
  const [opening, setOpening] = useState(false);

  const initials = names.split("&").map((n) => n.trim()[0] || "").filter(Boolean);

  const handleClick = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1400);
  };

  return (
    <AnimatePresence>
      {!opening ? (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(135deg, hsl(340 35% 96%) 0%, hsl(30 40% 97%) 50%, hsl(280 30% 96%) 100%)",
          }}
          onClick={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {["🌸", "🌿", "💐", "✨", "🌺"].map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl opacity-20"
                style={{
                  top: `${15 + i * 18}%`,
                  left: `${10 + i * 20}%`,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Tap hint */}
          <motion.p
            className="font-body text-xs tracking-[0.3em] uppercase mb-8"
            style={{ color: "hsl(340 25% 55%)" }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t("event.tapToOpen")}
          </motion.p>

          {/* Envelope */}
          <div className="relative w-[280px] h-[200px] sm:w-[340px] sm:h-[240px] md:w-[400px] md:h-[280px]">
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-md overflow-hidden flex items-end justify-center pb-8 sm:pb-10 md:pb-12"
              style={{
                background: "linear-gradient(135deg, hsl(340 30% 94%) 0%, hsl(30 35% 96%) 100%)",
                boxShadow: "0 8px 32px rgba(219, 112, 147, 0.15), 0 4px 16px rgba(255, 192, 203, 0.1)",
              }}
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                  backgroundSize: "200% 200%",
                }}
                animate={{ backgroundPosition: ["-200% center", "200% center"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Initials */}
              <div className="flex items-center gap-1 relative z-20">
                {initials[0] && (
                  <span
                    className="text-[2.6rem] sm:text-[3rem] md:text-[3.5rem]"
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      color: "hsl(340 45% 50%)",
                      textShadow: "0 2px 8px rgba(219, 112, 147, 0.3)",
                    }}
                  >
                    {initials[0]}
                  </span>
                )}
                <span
                  className="text-[1.1rem] sm:text-[1.3rem] md:text-[1.5rem] mx-1"
                  style={{ fontFamily: "var(--font-display)", color: "hsl(30 40% 45%)" }}
                >
                  &amp;
                </span>
                {initials[1] && (
                  <span
                    className="text-[2.6rem] sm:text-[3rem] md:text-[3.5rem]"
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      color: "hsl(340 45% 50%)",
                      textShadow: "0 2px 8px rgba(219, 112, 147, 0.3)",
                    }}
                  >
                    {initials[1]}
                  </span>
                )}
              </div>
            </div>

            {/* Top flap SVG */}
            <svg
              className="absolute top-0 left-0 w-full z-10"
              viewBox="0 0 400 160"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
            >
              <polygon
                points="0,0 200,160 400,0"
                fill="hsl(340, 28%, 92%)"
              />
            </svg>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="opening"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(340 35% 96%) 0%, hsl(30 40% 97%) 50%, hsl(280 30% 96%) 100%)",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
      )}
    </AnimatePresence>
  );
};

export default EnvelopeIntro;
