import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MapPin, Clock, Music, Sparkles, Star } from "lucide-react";
import { useTranslation } from "@/i18n";
import GiftBoxIntro from "./GiftBoxIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import RevealSection from "./RevealSection";
import SectionBackground from "./SectionBackground";
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

const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#FF6B9D", "#C44DFF", "#FFD93D", "#6BCB77", "#4D96FF", "#FF8A65"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const size = 5 + Math.random() * 7;
  const shapes = ["rounded-sm", "rounded-full"];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return (
    <motion.div
      className={`absolute ${shape} pointer-events-none`}
      style={{ left: `${left}%`, top: -20, width: size, height: size * (0.6 + Math.random() * 0.8), backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{ y: "100vh", opacity: 0, rotate: 360 + Math.random() * 360 }}
      transition={{ duration: 3 + Math.random() * 2.5, delay, ease: "easeIn" }}
    />
  );
};

const PartyDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-2 my-2">
    <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    <Star className="w-4 h-4" style={{ color, opacity: 0.5 }} />
    <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
  </div>
);

/* Angled section wave divider */
const WaveDivider = ({ color, flip }: { color: string; flip?: boolean }) => (
  <div className="relative w-full h-12 -my-1 overflow-hidden" style={{ transform: flip ? "scaleY(-1)" : undefined }}>
    <svg viewBox="0 0 1440 48" fill="none" className="w-full h-full" preserveAspectRatio="none">
      <path d="M0 48L60 40C120 32 240 16 360 8C480 0 600 0 720 8C840 16 960 32 1080 40C1200 48 1320 48 1380 48L1440 48V0H0V48Z" fill={color} />
    </svg>
  </div>
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
  const accent = theme?.primary || "hsl(340, 65%, 50%)";
  const secondaryAccent = "hsl(280, 60%, 55%)";
  const maxCompanions = blockCfg.max_companions ?? 5;

  const bgLight = "hsl(30, 30%, 98%)";
  const bgCard = "hsl(30, 25%, 96%)";

  return (
    <GuestNameProvider>
    <div className="min-h-screen overflow-hidden" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'DM Sans', sans-serif" }}>
      <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme?.font || 'DM Sans')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <GiftBoxIntro title={event.title} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} accentColor={accent} />}

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
              background: event.hero_image_url ? undefined
                : theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 50%, ${theme.primary} 100%)`
                : `linear-gradient(135deg, hsl(340 65% 50%) 0%, hsl(280 60% 55%) 50%, hsl(340 70% 60%) 100%)`,
            }}>
              {event.hero_image_url && (
                <>
                  <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
                </>
              )}
              {!event.hero_image_url && (
                <>
                  <div className="absolute top-[10%] left-[5%] w-40 h-40 rounded-full bg-white/[0.07] blur-3xl" />
                  <div className="absolute bottom-[15%] right-[8%] w-56 h-56 rounded-full bg-white/[0.05] blur-3xl" />
                  <div className="absolute top-[50%] right-[20%] w-24 h-24 rounded-full bg-white/[0.06] blur-2xl" />
                  {/* Floating confetti */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ConfettiParticle key={i} delay={i * 0.6} />
                  ))}
                </>
              )}
              <motion.div className="relative z-10 text-center px-4" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <PartyPopper className="w-16 h-16 mx-auto mb-6 text-white/80" />
                </motion.div>
                <p className="font-body text-sm tracking-[0.3em] uppercase mb-4 text-white/70">{el?.letsCelebrate || t("event.letsCelebrate")}</p>
                {/* Gradient text title */}
                <h1
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
                  style={{
                    background: event.hero_image_url
                      ? "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #ffd4e0 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.1,
                  }}
                >{event.title}</h1>
                <PartyDivider color="rgba(255,255,255,0.5)" />
                <p className="font-display text-2xl md:text-3xl text-white/90 italic mt-4">{formattedDate}</p>
                {event.description && <p className="font-body text-white/70 mt-4 text-lg max-w-md mx-auto">{event.description}</p>}
              </motion.div>
            </section>

            {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

            {/* Wave transition */}
            <WaveDivider color={bgLight} />

            {/* Countdown */}
            <RevealSection variant="slide-left" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgLight }} as="section">
              <SectionBackground variant="mesh" accentColor={accent} secondaryColor={secondaryAccent} />
              <div className="relative max-w-3xl mx-auto px-4 text-center">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">{el?.countdown || t("event.countdown")}</p>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{el?.countdownSub || t("event.countdownSub")}</h2>
                <PartyDivider color={accent} />
                <div className="mt-10">
                  <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} accentColor={accent} />
                </div>
              </div>
            </RevealSection>

            {/* Story / About */}
            {event.story_text && (
              <>
                <WaveDivider color={bgCard} />
                <RevealSection variant="slide-right" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgCard }} as="section">
                  <SectionBackground variant="mesh" accentColor={secondaryAccent} secondaryColor={accent} />
                  <div className="relative max-w-2xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                      <Music className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.party || t("event.party")}</h2>
                    <PartyDivider color={accent} />
                    <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
                  </div>
                </RevealSection>
              </>
            )}

            {/* Timeline */}
            {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
              <>
                <WaveDivider color={bgLight} />
                <RevealSection variant="slide-left" className="py-20 relative overflow-hidden" style={{ backgroundColor: bgLight }} as="section">
                  <SectionBackground variant="subtle-gradient" accentColor={accent} secondaryColor={secondaryAccent} />
                  <div className="relative max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                        <Clock className="w-6 h-6" style={{ color: accent }} />
                      </div>
                      <h2 className="font-display text-2xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
                      <PartyDivider color={accent} />
                    </div>
                    <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
                  </div>
                </RevealSection>
              </>
            )}

            {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
            {hasBlock("-dresscode") && (
              <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
            )}

            {/* Details */}
            <WaveDivider color={bgCard} />
            <RevealSection variant="slide-right" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgCard }} as="section">
              <SectionBackground variant="mesh" accentColor={accent} secondaryColor={secondaryAccent} />
              <div className="relative max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.details || t("event.details")}</h2>
                  <PartyDivider color={accent} />
                </div>
                <div className="grid md:grid-cols-1 gap-12 max-w-lg mx-auto">
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                      <MapPin className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-3">{el?.venue || t("event.venue")}</h3>
                    <p className="font-body text-sm text-muted-foreground">{event.location_name || "—"}</p>
                    <p className="font-body text-sm text-muted-foreground">{event.address || ""}</p>
                  </motion.div>
                </div>
                {event.address && (
                  <div className="mt-12 max-w-xl mx-auto"><GoogleMapsEmbed address={event.address} /></div>
                )}
              </div>
            </RevealSection>

            {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
              <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
            )}

            {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="birthday" />}
            {hasBlock("-quiz") && <QuizSection questions={blockCfg.quiz} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-games") && <GamesVoteSection games={blockCfg.games} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-potluck") && <PotluckSection items={blockCfg.potluck} accentColor={accent} lang={lang} eventId={event.id} isPreview={isDemo} />}
            {hasBlock("-wishlist") && <WishlistSection items={blockCfg.wishlist} accentColor={accent} lang={lang} />}
            {hasBlock("-musicwish") && <MusicWishSection accentColor={accent} eventId={event.id} lang={lang} isPreview={isDemo} />}

            {event.rsvp_enabled && (
              <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="birthday" lang={lang} maxCompanions={maxCompanions} accentColor={accent} />
            )}

            {/* Footer */}
            <RevealSection variant="fade" className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: bgLight }} as="footer">
              <SectionBackground variant="subtle-gradient" accentColor={accent} secondaryColor={secondaryAccent} />
              <div className="relative">
                <h2 className="font-display text-3xl mb-2" style={{ color: accent }}>{event.title}</h2>
                <PartyDivider color={accent} />
                <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase mt-3">{formattedDate}</p>
              </div>
            </RevealSection>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </GuestNameProvider>
  );
};

export default PremiumBirthdayPage;
