import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, ChevronDown, Baby, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import EnvelopeIntro from "./EnvelopeIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import RevealSection from "./RevealSection";
import SectionBackground from "./SectionBackground";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { GuestNameProvider } from "@/hooks/useGuestName";

import WishlistSection from "@/components/blocks/WishlistSection";
import SlideshowSection from "@/components/blocks/SlideshowSection";
import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import ShuttleSection from "@/components/blocks/ShuttleSection";
import MusicProSection from "@/components/blocks/MusicProSection";
import BackgroundMusicSection from "@/components/blocks/BackgroundMusicSection";
import CustomIllustrationSection from "@/components/blocks/CustomIllustrationSection";
import DressCodeMFSection from "@/components/blocks/DressCodeMFSection";
import VideoMessageSection from "@/components/blocks/VideoMessageSection";
import { colorWithAlpha } from "@/lib/color-utils";

export interface PremiumEventData {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  description?: string | null;
  location_name?: string | null;
  address?: string | null;
  story_text?: string | null;
  ceremony_location?: string | null;
  ceremony_address?: string | null;
  reception_location?: string | null;
  reception_address?: string | null;
  schedule?: any;
  hero_image_url?: string | null;
  rsvp_enabled?: boolean | null;
  rsvp_deadline?: string | null;
  menu_selection?: boolean | null;
  dress_code?: string | null;
  children_welcome?: boolean | null;
  hotel_recommendations?: any;
  selectedBlocks?: string[];
  selected_blocks?: string[];
  block_config?: any;
}

export interface PremiumTheme {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
}

const FloralDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-2">
    <svg width="60" height="16" viewBox="0 0 60 16" fill="none" style={{ opacity: 0.3 }}>
      <path d="M0 8C10 3 20 3 30 8C40 3 50 3 60 8" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="30" cy="8" r="2.5" fill={color} />
      <path d="M10 8C15 6 20 6 25 8" stroke={color} strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M35 8C40 6 45 6 50 8" stroke={color} strokeWidth="0.5" fill="none" opacity="0.5" />
    </svg>
  </div>
);

/* Decorative frame corners for hero */
const HeroFrame = ({ color }: { color: string }) => (
  <>
    <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 pointer-events-none rounded-tl-sm" style={{ borderColor: colorWithAlpha(color, 0.3) }} />
    <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 pointer-events-none rounded-tr-sm" style={{ borderColor: colorWithAlpha(color, 0.3) }} />
    <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 pointer-events-none rounded-bl-sm" style={{ borderColor: colorWithAlpha(color, 0.3) }} />
    <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 pointer-events-none rounded-br-sm" style={{ borderColor: colorWithAlpha(color, 0.3) }} />
  </>
);

const PremiumWeddingPage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const names = event.title;
  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, {
    day: "numeric", month: "long", year: "numeric",
  });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(150, 18%, 38%)";
  const softPink = "hsl(10, 50%, 82%)";
  const maxCompanions = blockCfg.max_companions ?? 5;
  const bgBase = theme?.secondary || "hsl(30, 33%, 96%)";
  const bgAlt = "hsl(30, 30%, 98%)";

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Lato', 'DM Sans', sans-serif", backgroundColor: bgBase, color: theme?.accent || "hsl(30, 10%, 25%)" }}>
      <link href={`https://fonts.googleapis.com/css2?family=Great+Vibes&family=${encodeURIComponent(theme?.font || 'Playfair Display')}:wght@300;400;500;600;700&family=Lato:wght@300;400;500&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <EnvelopeIntro names={names} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} tapLabel={el?.tapToOpen} />}

      {showContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {event.hero_image_url ? (
              <>
                <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
              </>
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, hsl(340 30% 92%) 0%, hsl(30 35% 95%) 40%, hsl(150 15% 90%) 100%)` }} />
                <SectionBackground variant="watercolor" accentColor={accent} secondaryColor={softPink} />
              </>
            )}
            <HeroFrame color={event.hero_image_url ? "rgba(255,255,255,0.4)" : accent} />
            <motion.div className="relative z-10 text-center px-8 py-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
              <p className="font-body text-sm tracking-[0.35em] uppercase mb-6" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.8)" : "hsl(30, 8%, 50%)" }}>{el?.weMarry || t("event.weMarry")}</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6" style={{ fontFamily: "'Great Vibes', cursive", color: event.hero_image_url ? "white" : "hsl(30, 10%, 25%)", lineHeight: 1.2 }}>{names}</h1>
              <FloralDivider color={event.hero_image_url ? "rgba(255,255,255,0.5)" : accent} />
              <p className="text-xl md:text-2xl italic mt-6" style={{ fontFamily: "var(--font-display)", color: event.hero_image_url ? "rgba(255,255,255,0.9)" : "hsl(30, 10%, 35%)" }}>{formattedDate}</p>
              {event.description && <p className="font-body text-sm mt-4 tracking-[0.15em] uppercase max-w-md mx-auto" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.7)" : "hsl(30, 8%, 50%)" }}>{event.description}</p>}
            </motion.div>
            <button className="absolute bottom-8 left-1/2 -translate-x-1/2" onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })} style={{ color: event.hero_image_url ? "rgba(255,255,255,0.6)" : "hsl(30, 8%, 50%)" }}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}><ChevronDown className="w-6 h-6" /></motion.div>
            </button>
          </section>

          {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

          {/* Countdown */}
          <RevealSection variant="fade-scale" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgAlt }} as="section">
            <div id="countdown" className="absolute -top-20" />
            <SectionBackground variant="watercolor" accentColor={softPink} secondaryColor={accent} />
            <div className="relative max-w-3xl mx-auto px-4 text-center">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">{el?.countdown || t("event.countdown")}</p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{el?.countdownSub || t("event.countdownSub")}</h2>
              <FloralDivider color={accent} />
              <div className="mt-10">
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} accentColor={accent} />
              </div>
            </div>
          </RevealSection>

          {/* Story */}
          {event.story_text && (
            <RevealSection variant="fade-up" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgBase }} as="section">
              <SectionBackground variant="watercolor" accentColor={accent} secondaryColor={softPink} />
              <div className="relative max-w-2xl mx-auto px-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: softPink }} />
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.ourStory || t("event.ourStory")}</h2>
                <FloralDivider color={softPink} />
                <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
              </div>
            </RevealSection>
          )}

          {hasBlock("-illustration") && <CustomIllustrationSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}
          {hasBlock("-slideshow") && <SlideshowSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}

          {/* Schedule Timeline */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <RevealSection variant="fade-scale" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgAlt }} as="section">
              <SectionBackground variant="subtle-gradient" accentColor={accent} secondaryColor={softPink} />
              <div className="relative max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                  <Clock className="w-6 h-6 mx-auto mb-3" style={{ color: accent }} />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
                  <FloralDivider color={accent} />
                </div>
                <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
              </div>
            </RevealSection>
          )}

          {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
          {hasBlock("-dresscode") && (
            <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
          )}

          {/* Details */}
          <RevealSection variant="fade-up" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgBase }} as="section">
            <SectionBackground variant="watercolor" accentColor={softPink} secondaryColor={accent} />
            <div className="relative max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.details || t("event.details")}</h2>
                <FloralDivider color={softPink} />
              </div>
              <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.12) }}>
                    <MapPin className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.ceremony || t("event.ceremony")}</h3>
                  <p className="font-body text-sm text-muted-foreground">{event.ceremony_location || event.location_name || "—"}</p>
                  <p className="font-body text-sm text-muted-foreground">{event.ceremony_address || event.address || ""}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="text-center p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.12) }}>
                    <MapPin className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.reception || t("event.reception")}</h3>
                  <p className="font-body text-sm text-muted-foreground">{event.reception_location || event.location_name || "—"}</p>
                  <p className="font-body text-sm text-muted-foreground">{event.reception_address || event.address || ""}</p>
                </motion.div>
              </div>
              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-card/60 rounded-full border border-border/30 shadow-sm">
                    <Baby className="w-4 h-4 text-muted-foreground" />
                    <p className="font-body text-sm text-muted-foreground italic">
                      {event.children_welcome ? (el?.childrenWelcome || t("event.childrenWelcome")) : (el?.adultsOnly || t("event.adultsOnly"))}
                    </p>
                  </div>
                </motion.div>
              )}
              {(event.address || event.ceremony_address) && (
                <div className="mt-12 max-w-xl mx-auto">
                  <GoogleMapsEmbed address={event.ceremony_address || event.address || ""} />
                </div>
              )}
            </div>
          </RevealSection>

          {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
            <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
          )}

          {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="wedding" />}
          {hasBlock("-shuttle") && <ShuttleSection routes={blockCfg.shuttle} accentColor={accent} lang={lang} />}
          {hasBlock("-wishlist") && <WishlistSection items={blockCfg.wishlist} accentColor={accent} lang={lang} />}
          {hasBlock("-musicpro") && <MusicProSection accentColor={accent} eventId={event.id} lang={lang} isPreview={isDemo} />}

          {event.rsvp_enabled && (
            <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="wedding" lang={lang} maxCompanions={maxCompanions} accentColor={accent} />
          )}

          {/* Footer */}
          <RevealSection variant="fade" className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: bgAlt }} as="footer">
            <SectionBackground variant="subtle-gradient" accentColor={accent} secondaryColor={softPink} />
            <div className="relative">
              <h2 className="text-4xl mb-3" style={{ fontFamily: "'Great Vibes', cursive", color: accent }}>{names}</h2>
              <FloralDivider color={accent} />
              <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase mt-3">{formattedDate.replace(/\s/g, " · ")}</p>
            </div>
          </RevealSection>
        </motion.div>
      )}
    </div>
    </GuestNameProvider>
  );
};

export default PremiumWeddingPage;
