import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MapPin, Clock, Music } from "lucide-react";
import { useTranslation } from "@/i18n";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

import { PremiumEventData, PremiumTheme } from "./PremiumWeddingPage";

// Simple confetti particles
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#FF6B9D", "#C44DFF", "#FFD93D", "#6BCB77", "#4D96FF"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{ left: `${left}%`, top: -20, width: size, height: size, backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: "100vh", opacity: 0, rotate: 360 + Math.random() * 360 }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeIn" }}
    />
  );
};

const PremiumBirthdayPage = ({ event, theme, lang }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(false);
  const [confetti, setConfetti] = useState<number[]>([]);

  const formattedDate = new Date(event.event_date).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    // Launch confetti on mount
    const particles = Array.from({ length: 30 }, (_, i) => i);
    setConfetti(particles);
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Confetti overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {confetti.map((i) => (
          <ConfettiParticle key={i} delay={i * 0.08} />
        ))}
      </div>

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Hero */}
            <section
              className="relative min-h-screen flex items-center justify-center"
              style={{
                background: event.hero_image_url
                  ? undefined
                  : theme
                    ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 50%, ${theme.primary} 100%)`
                    : "linear-gradient(135deg, hsl(340 65% 50%) 0%, hsl(280 60% 55%) 50%, hsl(340 70% 60%) 100%)",
              }}
            >
              {event.hero_image_url && (
                <>
                  <div className="absolute inset-0">
                    <img src={event.hero_image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40" />
                </>
              )}

              <motion.div
                className="relative z-10 text-center px-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <PartyPopper className="w-16 h-16 mx-auto mb-6 text-white/80" />
                </motion.div>
                <p className="font-body text-sm tracking-[0.3em] uppercase mb-4 text-white/70">
                  {el?.letsCelebrate || t("event.letsCelebrate")}
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">
                  {event.title}
                </h1>
                <div className="w-24 h-px mx-auto mb-4 bg-white/40" />
                <p className="font-display text-2xl md:text-3xl text-white/90 italic">
                  {formattedDate}
                </p>
                {event.description && (
                  <p className="font-body text-white/70 mt-4 text-lg max-w-md mx-auto">
                    {event.description}
                  </p>
                )}
              </motion.div>
            </section>

            {/* Countdown */}
            <section className="py-20 bg-card">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  {el?.countdown || t("event.countdown")}
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12">
                  {el?.countdownSub || t("event.countdownSub")}
                </h2>
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
              </div>
            </section>

            {/* Story / About */}
            {event.story_text && (
              <section className="py-24 bg-background">
                <div className="max-w-2xl mx-auto px-4 text-center">
                  <Music className="w-6 h-6 mx-auto mb-4 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">
                    {el?.party || t("event.party")}
                  </h2>
                  <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.story_text}
                  </p>
                </div>
              </section>
            )}

            {/* Details */}
            <section className="py-24 bg-card">
              <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.details || t("event.details")}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-display text-xl text-foreground mb-3">{el?.venue || t("event.venue")}</h3>
                    <p className="font-body text-sm text-muted-foreground">{event.location_name || "—"}</p>
                    <p className="font-body text-sm text-muted-foreground">{event.address || ""}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-4 text-primary" />
                    <h3 className="font-display text-xl text-foreground mb-3">{el?.program || t("event.program")}</h3>
                    {event.schedule && Array.isArray(event.schedule) ? (
                      event.schedule.map((item: { time: string; label: string }, i: number) => (
                        <p key={i} className="font-body text-sm text-muted-foreground">
                          {item.label}: {item.time}
                        </p>
                      ))
                    ) : (
                      <p className="font-body text-sm text-muted-foreground">{event.event_time} Uhr</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP */}
            {event.rsvp_enabled && (
              <RsvpForm
                eventId={event.id}
                rsvpDeadline={event.rsvp_deadline}
                menuSelection={event.menu_selection || false}
                variant="birthday"
                lang={lang}
              />
            )}

            {/* Footer */}
            <footer className="py-16 text-center bg-card">
              <h2 className="font-display text-3xl text-primary mb-2">{event.title}</h2>
              <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase">
                {formattedDate}
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumBirthdayPage;
