import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MapPin, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import GiftBoxIntro from "./GiftBoxIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { GuestNameProvider } from "@/hooks/useGuestName";

import { PremiumEventData, PremiumTheme } from "./PremiumWeddingPage";
import { colorWithAlpha } from "@/lib/color-utils";

import MusicWishSection from "@/components/blocks/MusicWishSection";
import WishlistSection from "@/components/blocks/WishlistSection";
import DressCodeMFSection from "@/components/blocks/DressCodeMFSection";
import QuizSection from "@/components/blocks/QuizSection";
import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import GamesVoteSection from "@/components/blocks/GamesVoteSection";
import PotluckSection from "@/components/blocks/PotluckSection";
import BackgroundMusicSection from "@/components/blocks/BackgroundMusicSection";
import VideoMessageSection from "@/components/blocks/VideoMessageSection";

/* Floating emoji particles in the background */
const FloatingEmoji = ({ emoji, delay, x, size }: { emoji: string; delay: number; x: number; size: number }) => (
  <motion.span
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, top: "-5%", fontSize: size }}
    animate={{ y: "110vh", rotate: [0, 180, 360], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: "linear" }}
  >
    {emoji}
  </motion.span>
);

const PremiumBirthdayPage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "#E040FB";
  const accentDark = theme?.accent || "#7B1FA2";
  const maxCompanions = blockCfg.max_companions ?? 5;

  /* Pre-generated floating emojis */
  const emojis = useMemo(() => {
    const pool = ["🎉", "🎈", "🎂", "✨", "🥳", "🎁", "🎊", "💫", "⭐"];
    return Array.from({ length: 12 }, (_, i) => ({
      emoji: pool[i % pool.length],
      delay: i * 1.5,
      x: 5 + (i * 8) % 90,
      size: 16 + Math.random() * 12,
    }));
  }, []);

  /* Gradient mesh background */
  const meshGradient = theme
    ? `radial-gradient(ellipse at 20% 50%, ${colorWithAlpha(theme.primary, 0.15)} 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colorWithAlpha(theme.accent || theme.primary, 0.1)} 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, ${colorWithAlpha(theme.primary, 0.08)} 0%, transparent 50%)`
    : `radial-gradient(ellipse at 20% 50%, rgba(224,64,251,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,64,129,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(124,77,255,0.1) 0%, transparent 50%)`;

  return (
    <GuestNameProvider>
    <div className="min-h-screen overflow-hidden" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Space Grotesk', 'DM Sans', sans-serif", backgroundColor: "#0A0A0F", color: "#FAFAFA" }}>
      <link href={`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=${encodeURIComponent(theme?.font || 'DM Sans')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <GiftBoxIntro title={event.title} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} accentColor={accent} />}

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>

            {/* ─── HERO ─── Dark gradient with floating emojis */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {event.hero_image_url ? (
                <>
                  <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 100%)" }} />
                </>
              ) : (
                <>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, #0F0F1A 0%, #1A0A2E 40%, #0A0A0F 100%)` }} />
                  <div className="absolute inset-0" style={{ background: meshGradient }} />
                  {/* Floating emojis */}
                  {emojis.map((e, i) => <FloatingEmoji key={i} {...e} />)}
                </>
              )}

              {/* Grain texture */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

              <motion.div
                className="relative z-10 text-center px-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 backdrop-blur-xl"
                  style={{ background: colorWithAlpha(accent, 0.15), border: `1px solid ${colorWithAlpha(accent, 0.2)}` }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-xs font-medium tracking-widest uppercase" style={{ color: accent }}>
                    {el?.letsCelebrate || t("event.letsCelebrate")}
                  </span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]" style={{ fontFamily: "'Space Grotesk', sans-serif", background: `linear-gradient(135deg, #fff 0%, ${accent} 50%, #fff 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto" }}>
                  {event.title}
                </h1>

                <p className="text-xl md:text-2xl font-light tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {formattedDate}
                </p>

                {event.description && (
                  <p className="mt-6 text-base md:text-lg max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {event.description}
                  </p>
                )}
              </motion.div>

              {/* Scroll indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div
                  className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                    animate={{ y: [0, 16, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </section>

            {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

            {/* ─── COUNTDOWN ─── Glassmorphism card */}
            <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
              <div className="absolute inset-0" style={{ background: meshGradient, opacity: 0.5 }} />
              <div className="relative max-w-2xl mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl p-10 md:p-14 text-center backdrop-blur-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>
                    {el?.countdown || t("event.countdown")}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {el?.countdownSub || t("event.countdownSub")}
                  </h2>
                  <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
                </motion.div>
              </div>
            </section>

            {/* ─── STORY ─── Bold typography section */}
            {event.story_text && (
              <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#0D0D14" }}>
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${colorWithAlpha(accent, 0.06)} 0%, transparent 60%)` }} />
                <div className="relative max-w-2xl mx-auto px-6 text-center">
                  <PartyPopper className="w-8 h-8 mx-auto mb-6" style={{ color: accent }} />
                  <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {el?.party || t("event.party")}
                  </h2>
                  <p className="text-lg md:text-xl leading-[1.8] whitespace-pre-line" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {event.story_text}
                  </p>
                </div>
              </section>
            )}

            {/* ─── SCHEDULE ─── */}
            {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
              <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
                <div className="relative max-w-3xl mx-auto px-6">
                  <div className="text-center mb-14">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: colorWithAlpha(accent, 0.1), border: `1px solid ${colorWithAlpha(accent, 0.15)}` }}>
                      <Clock className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                      {el?.timeline || t("event.timeline")}
                    </h2>
                  </div>
                  <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
                </div>
              </section>
            )}

            {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
            {hasBlock("-dresscode") && (
              <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
            )}

            {/* ─── DETAILS ─── Glass card with neon glow */}
            <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#0D0D14" }}>
              <div className="absolute inset-0" style={{ background: meshGradient, opacity: 0.3 }} />
              <div className="relative max-w-4xl mx-auto px-6">
                <div className="text-center mb-14">
                  <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {el?.details || t("event.details")}
                  </h2>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-md mx-auto rounded-3xl p-10 text-center backdrop-blur-xl relative"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: `0 0 80px ${colorWithAlpha(accent, 0.08)}` }}
                >
                  <div className="w-12 h-12 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: colorWithAlpha(accent, 0.12) }}>
                    <MapPin className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
                    {el?.venue || t("event.venue")}
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{event.location_name || "—"}</p>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{event.address || ""}</p>
                </motion.div>
                {event.address && (
                  <div className="mt-12 max-w-xl mx-auto rounded-2xl overflow-hidden"><GoogleMapsEmbed address={event.address} /></div>
                )}
              </div>
            </section>

            {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
              <HotelRecommendations hotels={event.hotel_recommendations} />
            )}

            {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="birthday" />}
            {hasBlock("-quiz") && <QuizSection questions={blockCfg.quiz} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-games") && <GamesVoteSection games={blockCfg.games} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-potluck") && <PotluckSection items={blockCfg.potluck} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-wishlist") && <WishlistSection items={blockCfg.wishlist} accentColor={accent} lang={lang} />}
            {hasBlock("-musicwish") && <MusicWishSection accentColor={accent} eventId={event.id} lang={lang} isPreview={isDemo} />}

            {event.rsvp_enabled && (
              <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="birthday" lang={lang} maxCompanions={maxCompanions} />
            )}

            {/* ─── FOOTER ─── */}
            <footer className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ background: `linear-gradient(135deg, ${accent}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {event.title}
                </h2>
                <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{formattedDate}</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </GuestNameProvider>
  );
};

export default PremiumBirthdayPage;
