import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

export type CountdownVariant = "floral" | "classic" | "modern";

interface CountdownTimerProps {
  targetDate: string;
  targetTime?: string;
  className?: string;
  lang?: EventLang;
  variant?: CountdownVariant;
  accentColor?: string;
}

/** Single flip digit – fixed height to prevent layout bounce */
const FlipDigit = ({ value, prevValue }: { value: string; prevValue: string }) => {
  const changed = value !== prevValue;
  return (
    <span className="relative inline-block overflow-hidden align-top" style={{ width: "1ch", height: "1em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={changed ? { y: "-100%", opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block absolute inset-0"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const CountdownTimer = ({ targetDate, targetTime, className, lang, variant = "floral", accentColor = "hsl(150,18%,38%)" }: CountdownTimerProps) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prev, setPrev] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const [year, month, day] = targetDate.split("-").map(Number);
    const [hours, minutes] = (targetTime || "12:00").split(":").map(Number);
    const target = new Date(year, month - 1, day, hours, minutes, 0).getTime();

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft(prev => {
        setPrev(prev);
        return {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const items = [
    { value: pad(timeLeft.days), prev: pad(prev.days), label: el?.days || t("event.days") },
    { value: pad(timeLeft.hours), prev: pad(prev.hours), label: el?.hours || t("event.hours") },
    { value: pad(timeLeft.minutes), prev: pad(prev.minutes), label: el?.minutes || t("event.minutes") },
    { value: pad(timeLeft.seconds), prev: pad(prev.seconds), label: el?.seconds || t("event.seconds") },
  ];

  // Variant-specific card styles
  const cardStyles: Record<CountdownVariant, string> = {
    floral: "bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl shadow-sm",
    classic: "bg-card/50 backdrop-blur-sm border-2 rounded-none shadow-md",
    modern: "bg-card/80 backdrop-blur-md border-0 rounded-full shadow-lg",
  };

  const separatorColor = accentColor;

  return (
    <div className={className}>
      <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-5">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2 sm:gap-3 md:gap-5">
            {/* Card */}
            <div className={`text-center px-3 py-4 sm:px-5 sm:py-6 md:px-7 md:py-8 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] ${cardStyles[variant]}`}
              style={variant === "classic" ? { borderColor: accentColor + "66" } : undefined}>
              <p className="font-display text-[1.6rem] sm:text-[2.2rem] md:text-[3.2rem] tabular-nums leading-none"
                style={{ color: accentColor }}>
                {item.value.split("").map((char, ci) => (
                  <FlipDigit key={ci} value={char} prevValue={item.prev[ci] || char} />
                ))}
              </p>
              <p className="font-body text-[9px] sm:text-[10px] md:text-xs text-muted-foreground tracking-[0.12em] sm:tracking-[0.15em] uppercase mt-2">
                {item.label}
              </p>
            </div>
            {/* Separator */}
            {i < items.length - 1 && (
              <span className="text-lg sm:text-2xl md:text-3xl font-light select-none" style={{ color: separatorColor, opacity: 0.4 }}>
                {variant === "classic" ? "·" : ":"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
