import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, ChevronDown, Baby } from "lucide-react";
import { useTranslation } from "@/i18n";
import EnvelopeIntro from "./EnvelopeIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
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

/* Botanical leaf ornament — organic, hand-drawn feel */
const BotanicalDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-4 my-6">
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" style={{ opacity: 0.3 }}>
      <path d="M0 10 Q10 2 20 10 Q30 18 40 10 Q50 2 60 10" stroke={color} strokeWidth="0.8" fill="none" />
      <path d="M15 10 Q20 4 25 10" stroke={color} strokeWidth="0.5" fill="none" />
      <path d="M35 10 Q40 16 45 10" stroke={color} strokeWidth="0.5" fill="none" />
    </svg>
  </div>
);

/* Watercolor-style blob background */
const WatercolorBlob = ({ color, className }: { color: string; className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <path
        d="M44.5,-76.3C56.9,-68.1,66.1,-54.7,73.2,-40.3C80.3,-25.9,85.3,-10.5,83.8,4.2C82.3,18.9,74.3,32.9,64.2,44.6C54.1,56.3,41.9,65.7,28.2,72.1C14.5,78.5,-0.7,81.9,-15.4,79C-30.1,76.1,-44.3,66.9,-55.4,55.2C-66.5,43.5,-74.5,29.3,-78.6,13.8C-82.7,-1.7,-82.9,-18.5,-76.5,-32.1C-70.1,-45.7,-57.1,-56.1,-43.3,-63.6C-29.5,-71.1,-14.8,-75.7,0.9,-77.2C16.5,-78.7,32.1,-84.5,44.5,-76.3Z"
        transform="translate(100 100)"
        fill={color}
      />
    </svg>
  </div>
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
  const accent = theme?.primary || "#8B7355";
  const softRose = "#D4A89A";
  const cream = theme?.secondary || "#FAF6F1";
  const darkText = theme?.accent || "#3D3228";
  const maxCompanions = blockCfg.max_companions ?? 5;

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', serif` : "'Cormorant Garamond', 'Playfair Display', serif", backgroundColor: cream, color: darkText }}>
      <link href={`https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=${encodeURIComponent(theme?.font || 'Playfair Display')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <EnvelopeIntro names={names} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} tapLabel={el?.tapToOpen} />}

      {showContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

          {/* ─── HERO ─── Full-bleed romantic hero */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {event.hero_image_url ? (
              <>
                <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.45) 100%)" }} />
              </>
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${cream} 0%, #F5EDE4 40%, #EDE4D8 100%)` }} />
                <WatercolorBlob color={colorWithAlpha(softRose, 0.08)} className="w-[500px] h-[500px] -top-20 -right-20" />
                <WatercolorBlob color={colorWithAlpha(accent, 0.06)} className="w-[400px] h-[400px] -bottom-10 -left-20" />
                {/* Subtle paper texture */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
              </>
            )}

            <motion.div
              className="relative z-10 text-center px-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.p
                className="text-xs tracking-[0.4em] uppercase mb-8"
                style={{ color: event.hero_image_url ? "rgba(255,255,255,0.7)" : colorWithAlpha(darkText, 0.5), fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.35em" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                {el?.weMarry || t("event.weMarry")}
              </motion.p>

              <h1
                className="text-6xl md:text-8xl lg:text-9xl mb-4 leading-[0.95]"
                style={{ fontFamily: "'Great Vibes', cursive", color: event.hero_image_url ? "white" : darkText }}
              >
                {names}
              </h1>

              <BotanicalDivider color={event.hero_image_url ? "rgba(255,255,255,0.5)" : accent} />

              <p
                className="text-lg md:text-xl tracking-[0.2em] uppercase mt-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: event.hero_image_url ? "rgba(255,255,255,0.85)" : colorWithAlpha(darkText, 0.6) }}
              >
                {formattedDate}
              </p>

              {event.description && (
                <motion.p
                  className="mt-6 text-base md:text-lg italic max-w-md mx-auto"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: event.hero_image_url ? "rgba(255,255,255,0.7)" : colorWithAlpha(darkText, 0.5) }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                >
                  {event.description}
                </motion.p>
              )}
            </motion.div>

            <button
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              onClick={() => document.getElementById("wedding-countdown")?.scrollIntoView({ behavior: "smooth" })}
              style={{ color: event.hero_image_url ? "rgba(255,255,255,0.4)" : colorWithAlpha(darkText, 0.3) }}
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>
          </section>

          {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

          {/* ─── COUNTDOWN ─── Soft textured section */}
          <section id="wedding-countdown" className="py-28 md:py-36 relative overflow-hidden" style={{ backgroundColor: "#FDFBF8" }}>
            <WatercolorBlob color={colorWithAlpha(softRose, 0.04)} className="w-[300px] h-[300px] top-0 right-0" />
            <div className="relative max-w-3xl mx-auto px-6 text-center">
              <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: colorWithAlpha(darkText, 0.4), fontFamily: "'Cormorant Garamond', serif" }}>
                {el?.countdown || t("event.countdown")}
              </p>
              <h2 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: darkText }}>
                {el?.countdownSub || t("event.countdownSub")}
              </h2>
              <BotanicalDivider color={accent} />
              <div className="mt-12">
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
              </div>
            </div>
          </section>

          {/* ─── OUR STORY ─── Editorial layout with large pull quote feel */}
          {event.story_text && (
            <section className="py-28 md:py-36 relative overflow-hidden" style={{ backgroundColor: cream }}>
              <WatercolorBlob color={colorWithAlpha(accent, 0.04)} className="w-[400px] h-[400px] -bottom-20 -left-20" />
              <div className="relative max-w-xl mx-auto px-6 text-center">
                <Heart className="w-5 h-5 mx-auto mb-6" style={{ color: softRose, strokeWidth: 1.5 }} />
                <h2 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: darkText }}>
                  {el?.ourStory || t("event.ourStory")}
                </h2>
                <BotanicalDivider color={softRose} />
                <p
                  className="text-lg md:text-xl leading-[1.9] whitespace-pre-line mt-10"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: colorWithAlpha(darkText, 0.7) }}
                >
                  {event.story_text}
                </p>
              </div>
            </section>
          )}

          {hasBlock("-illustration") && <CustomIllustrationSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}
          {hasBlock("-slideshow") && <SlideshowSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}

          {/* ─── SCHEDULE ─── Elegant timeline */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <section className="py-28 md:py-36 relative overflow-hidden" style={{ backgroundColor: "#FDFBF8" }}>
              <div className="relative max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                  <Clock className="w-5 h-5 mx-auto mb-4" style={{ color: accent, strokeWidth: 1.5 }} />
                  <h2 className="text-2xl md:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: darkText }}>
                    {el?.timeline || t("event.timeline")}
                  </h2>
                  <BotanicalDivider color={accent} />
                </div>
                <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
              </div>
            </section>
          )}

          {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
          {hasBlock("-dresscode") && (
            <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
          )}

          {/* ─── DETAILS ─── Ceremony & Reception cards with organic styling */}
          <section className="py-28 md:py-36 relative overflow-hidden" style={{ backgroundColor: cream }}>
            <WatercolorBlob color={colorWithAlpha(softRose, 0.05)} className="w-[350px] h-[350px] top-10 -right-20" />
            <div className="relative max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-2xl md:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: darkText }}>
                  {el?.details || t("event.details")}
                </h2>
                <BotanicalDivider color={accent} />
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Ceremony */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center p-10 relative"
                  style={{ backgroundColor: "#FDFBF8", border: `1px solid ${colorWithAlpha(accent, 0.15)}` }}
                >
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <MapPin className="w-5 h-5 mx-auto mb-4" style={{ color: accent, strokeWidth: 1.5 }} />
                  <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: darkText }}>
                    {el?.ceremony || t("event.ceremony")}
                  </h3>
                  <p className="text-sm" style={{ color: colorWithAlpha(darkText, 0.6) }}>{event.ceremony_location || event.location_name || "—"}</p>
                  <p className="text-sm mt-1" style={{ color: colorWithAlpha(darkText, 0.5) }}>{event.ceremony_address || event.address || ""}</p>
                </motion.div>

                {/* Reception */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-center p-10 relative"
                  style={{ backgroundColor: "#FDFBF8", border: `1px solid ${colorWithAlpha(accent, 0.15)}` }}
                >
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r" style={{ borderColor: colorWithAlpha(accent, 0.3) }} />
                  <MapPin className="w-5 h-5 mx-auto mb-4" style={{ color: accent, strokeWidth: 1.5 }} />
                  <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: darkText }}>
                    {el?.reception || t("event.reception")}
                  </h3>
                  <p className="text-sm" style={{ color: colorWithAlpha(darkText, 0.6) }}>{event.reception_location || event.location_name || "—"}</p>
                  <p className="text-sm mt-1" style={{ color: colorWithAlpha(darkText, 0.5) }}>{event.reception_address || event.address || ""}</p>
                </motion.div>
              </div>

              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
                  <div className="inline-flex items-center gap-2 px-5 py-2" style={{ border: `1px solid ${colorWithAlpha(accent, 0.2)}` }}>
                    <Baby className="w-4 h-4" style={{ color: colorWithAlpha(darkText, 0.4) }} />
                    <p className="text-xs italic tracking-wide" style={{ color: colorWithAlpha(darkText, 0.5), fontFamily: "'Cormorant Garamond', serif" }}>
                      {event.children_welcome ? (el?.childrenWelcome || t("event.childrenWelcome")) : (el?.adultsOnly || t("event.adultsOnly"))}
                    </p>
                  </div>
                </motion.div>
              )}

              {(event.address || event.ceremony_address) && (
                <div className="mt-14 max-w-xl mx-auto">
                  <GoogleMapsEmbed address={event.ceremony_address || event.address || ""} />
                </div>
              )}
            </div>
          </section>

          {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
            <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
          )}

          {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="wedding" />}
          {hasBlock("-shuttle") && <ShuttleSection routes={blockCfg.shuttle} accentColor={accent} lang={lang} />}
          {hasBlock("-wishlist") && <WishlistSection items={blockCfg.wishlist} accentColor={accent} lang={lang} />}
          {hasBlock("-musicpro") && <MusicProSection accentColor={accent} eventId={event.id} lang={lang} isPreview={isDemo} />}

          {event.rsvp_enabled && (
            <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="wedding" lang={lang} maxCompanions={maxCompanions} />
          )}

          {/* ─── FOOTER ─── Minimal elegant */}
          <footer className="py-24 text-center relative overflow-hidden" style={{ backgroundColor: "#FDFBF8" }}>
            <div className="relative">
              <h2 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: "'Great Vibes', cursive", color: accent }}>{names}</h2>
              <BotanicalDivider color={accent} />
              <p className="text-xs tracking-[0.3em] uppercase mt-4" style={{ color: colorWithAlpha(darkText, 0.4), fontFamily: "'Cormorant Garamond', serif" }}>
                {formattedDate}
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
    </GuestNameProvider>
  );
};

export default PremiumWeddingPage;
