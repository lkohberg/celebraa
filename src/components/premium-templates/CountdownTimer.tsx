import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

interface CountdownTimerProps {
  targetDate: string;
  targetTime?: string;
  className?: string;
  lang?: EventLang;
}

const CountdownTimer = ({ targetDate, targetTime, className, lang }: CountdownTimerProps) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Parse date and time manually to avoid UTC interpretation
    const [year, month, day] = targetDate.split("-").map(Number);
    const [hours, minutes] = (targetTime || "12:00").split(":").map(Number);
    const target = new Date(year, month - 1, day, hours, minutes, 0).getTime();

    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const items = [
    { value: pad(timeLeft.days), label: el?.days || t("event.days") },
    { value: pad(timeLeft.hours), label: el?.hours || t("event.hours") },
    { value: pad(timeLeft.minutes), label: el?.minutes || t("event.minutes") },
    { value: pad(timeLeft.seconds), label: el?.seconds || t("event.seconds") },
  ];

  return (
    <div className={className}>
      <div className="flex justify-center gap-6 md:gap-12">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-display text-[2.5rem] md:text-[4rem] text-primary tabular-nums">
              {item.value}
            </p>
            <p className="font-body text-xs md:text-sm text-muted-foreground tracking-[0.15em] uppercase">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
