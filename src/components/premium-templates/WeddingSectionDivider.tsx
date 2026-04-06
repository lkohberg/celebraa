import { motion } from "framer-motion";

export type WeddingStyle = "floral" | "classic" | "modern";

interface WeddingSectionDividerProps {
  fromColor: string;
  toColor: string;
  style?: WeddingStyle;
  accentColor?: string;
  flip?: boolean;
}

/** Floral: organic wave with leaf curves */
const FloralWave = ({ from, to, accent }: { from: string; to: string; accent: string }) => (
  <div className="relative w-full -my-px" style={{ height: "80px" }}>
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="floralGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M0,0 L0,40 C120,70 240,20 360,45 C480,70 600,25 720,40 C840,55 960,20 1080,35 C1200,50 1320,25 1440,40 L1440,0 Z" fill={from} />
      <path d="M0,40 C120,70 240,20 360,45 C480,70 600,25 720,40 C840,55 960,20 1080,35 C1200,50 1320,25 1440,40 L1440,80 L0,80 Z" fill={to} />
    </svg>
    {/* Decorative leaf */}
    <svg viewBox="0 0 60 30" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-6 opacity-20" fill="none">
      <path d="M30 2 C15 2 2 15 2 28 C15 18 25 15 30 15 C35 15 45 18 58 28 C58 15 45 2 30 2Z" stroke={accent} strokeWidth="1" fill={accent} fillOpacity="0.1" />
      <line x1="30" y1="2" x2="30" y2="28" stroke={accent} strokeWidth="0.5" />
    </svg>
  </div>
);

/** Classic: elegant double line with diamond */
const ClassicDivider = ({ accent }: { accent: string }) => (
  <div className="relative w-full flex items-center justify-center py-6">
    <div className="w-full max-w-xl mx-auto flex items-center gap-4 px-8">
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-px w-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div className="h-px w-full" style={{ backgroundColor: accent, opacity: 0.15 }} />
      </div>
      <div className="flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="8" y="1" width="9.9" height="9.9" rx="1" transform="rotate(45 8 1)" stroke={accent} strokeWidth="1" fill="none" opacity={0.4} />
          <rect x="8" y="3" width="7.07" height="7.07" rx="0.5" transform="rotate(45 8 3)" fill={accent} fillOpacity={0.15} />
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="h-px w-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div className="h-px w-full" style={{ backgroundColor: accent, opacity: 0.15 }} />
      </div>
    </div>
  </div>
);

/** Modern: diagonal cut */
const ModernSlash = ({ from, to }: { from: string; to: string }) => (
  <div className="relative w-full -my-px" style={{ height: "60px" }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <polygon points="0,0 1440,0 1440,15 0,60" fill={from} />
      <polygon points="0,60 1440,15 1440,60" fill={to} />
    </svg>
  </div>
);

const WeddingSectionDivider = ({ fromColor, toColor, style = "floral", accentColor = "hsl(150,18%,38%)", flip }: WeddingSectionDividerProps) => {
  const from = flip ? toColor : fromColor;
  const to = flip ? fromColor : toColor;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {style === "floral" && <FloralWave from={from} to={to} accent={accentColor} />}
      {style === "classic" && <ClassicDivider accent={accentColor} />}
      {style === "modern" && <ModernSlash from={from} to={to} />}
    </motion.div>
  );
};

export default WeddingSectionDivider;
