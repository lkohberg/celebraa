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
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

import { PremiumEventData, PremiumTheme } from "./PremiumWeddingPage";

import MusicWishSection from "@/components/blocks/MusicWishSection";
import WishlistSection from "@/components/blocks/WishlistSection";
import DressCodeMFSection from "@/components/blocks/DressCodeMFSection";
import QuizSection from "@/components/blocks/QuizSection";
import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import GamesVoteSection from "@/components/blocks/GamesVoteSection";
import PotluckSection from "@/components/blocks/PotluckSection";

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
    <div className="w-8 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    <Star className="w-3 h-3" style={{ color, opacity: 0.4 }} />
    <div className="w-8 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
  </div>
);

const PremiumBirthdayPage = ({ event, theme, lang, showIntro = true, isDemo = false }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const formattedDate = new Date(event.event_date).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(340, 65%, 50%)";

  return (
    <div className="min-h-screen overflow-hidden" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'DM Sans', sans-serif" }}>
      <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme?.font || 'DM Sans')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <GiftBoxIntro title={event.title} onOpen={() => setShowContent(true)} accentColor={accent} />}

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
              background: event.hero_image_url ? undefined
                : theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 50%, ${theme.primary} 100%)`
                : "linear-gradient(135deg, hsl(340 65% 50%) 0%, hsl(280 60% 55%) 50%, hsl(340 70% 60%) 100%)",
            }}>
              {event.hero_image_url && (
                <>
                  <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" /></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
                </>
              )}
              {/* Decorative floating shapes */}
              {!event.hero_image_url && (
                <>
                  <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute bottom-[15%] right-[8%] w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                  <div className="absolute top-[40%] right-[15%] w-20 h-20 rounded-full bg-white/5 blur-xl" />
                </>
              )}
              <motion.div className="relative z-10 text-center px-4" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <PartyPopper className="w-16 h-16 mx-auto mb-6 text-white/80" />
                </motion.div>
                <p className="font-body text-sm tracking-[0.3em] uppercase mb-4 text-white/70">{el?.letsCelebrate || t("event.letsCelebrate")}</p>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">{event.title}</h1>
                <PartyDivider color="rgba(255,255,255,0.5)" />
                <p className="font-display text-2xl md:text-3xl text-white/90 italic mt-4">{formattedDate}</p>
                {event.description && <p className="font-body text-white/70 mt-4 text-lg max-w-md mx-auto">{event.description}</p>}
              </motion.div>
            </section>

            {/* Countdown */}
            <section className="py-24 relative overflow-hidden bg-card">
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${accent} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
              <div className="relative max-w-3xl mx-auto px-4 text-center">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">{el?.countdown || t("event.countdown")}</p>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{el?.countdownSub || t("event.countdownSub")}</h2>
                <PartyDivider color={accent} />
                <div className="mt-10">
                  <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
                </div>
              </div>
            </section>

            {/* Story / About */}
            {event.story_text && (
              <section className="py-28 relative overflow-hidden bg-background">
                <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
                <div className="relative max-w-2xl mx-auto px-4 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                    <Music className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.party || t("event.party")}</h2>
                  <PartyDivider color={accent} />
                  <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
                </div>
              </section>
            )}

            {/* Timeline */}
            {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
              <section className="py-20 relative overflow-hidden bg-background">
                <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
                <div className="relative max-w-3xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                      <Clock className="w-6 h-6" style={{ color: accent }} />
                    </div>
                    <h2 className="font-display text-2xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
                    <PartyDivider color={accent} />
                  </div>
                  <ScheduleTimeline schedule={event.schedule} />
                </div>
              </section>
            )}

            {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
            {hasBlock("-dresscode") && (
              <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
            )}

            {/* Details */}
            <section className="py-28 relative overflow-hidden bg-card">
              <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
              <div className="relative max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.details || t("event.details")}</h2>
                  <PartyDivider color={accent} />
                </div>
                <div className="grid md:grid-cols-1 gap-12 max-w-lg mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30">
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
            </section>

            {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
              <HotelRecommendations hotels={event.hotel_recommendations} />
            )}

            {hasBlock("-quiz") && <QuizSection questions={blockCfg.quiz} accentColor={accent} lang={lang} />}
            {hasBlock("-games") && <GamesVoteSection games={blockCfg.games} accentColor={accent} lang={lang} />}
            {hasBlock("-potluck") && <PotluckSection items={blockCfg.potluck} accentColor={accent} lang={lang} />}
            {hasBlock("-wishlist") && <WishlistSection items={blockCfg.wishlist} accentColor={accent} lang={lang} />}
            {hasBlock("-musicwish") && <MusicWishSection accentColor={accent} eventId={event.id} lang={lang} isPreview={isDemo} />}

            {event.rsvp_enabled && (
              <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="birthday" lang={lang} />
            )}

            {/* Footer */}
            <footer className="py-20 text-center relative overflow-hidden bg-card">
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "18px 18px" }} />
              <div className="relative">
                <h2 className="font-display text-3xl mb-2" style={{ color: accent }}>{event.title}</h2>
                <PartyDivider color={accent} />
                <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase mt-3">{formattedDate}</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumBirthdayPage;
