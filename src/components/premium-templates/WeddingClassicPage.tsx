/**
 * CLASSIC ELEGANCE – Timeless, symmetrical, serif-heavy
 * 
 * Layout DNA:
 * - Symmetrical grid layout with generous whitespace
 * - Double-line borders and golden accents
 * - Serif typography dominates
 * - No waves – clean geometric ornaments with diamonds
 * - Vertical centered sections with formal spacing
 * - Monogram-style initials in hero
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Baby, Church, Wine, CalendarPlus } from "lucide-react";
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
import { type PremiumEventData, type PremiumTheme } from "./PremiumWeddingPage";
import { buildGoogleCalUrl, buildIcsBlob } from "./calendarUtils";

/* Elegant double line with diamond */
const ClassicOrnament = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-4 my-6 max-w-md mx-auto">
    <div className="flex-1 flex flex-col gap-1">
      <div className="h-px w-full" style={{ backgroundColor: color, opacity: 0.3 }} />
      <div className="h-px w-full" style={{ backgroundColor: color, opacity: 0.15 }} />
    </div>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="7" y="0.5" width="9" height="9" rx="1" transform="rotate(45 7 0.5)" stroke={color} strokeWidth="1" fill="none" opacity={0.4} />
    </svg>
    <div className="flex-1 flex flex-col gap-1">
      <div className="h-px w-full" style={{ backgroundColor: color, opacity: 0.3 }} />
      <div className="h-px w-full" style={{ backgroundColor: color, opacity: 0.15 }} />
    </div>
  </div>
);

/* Extract initials for monogram */
const getInitials = (title: string) => {
  const parts = title.split(/\s*[&+]\s*|\s+und\s+|\s+and\s+/i);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return title.substring(0, 2).toUpperCase();
};

const WeddingClassicPage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const names = event.title;
  const initials = getInitials(names);
  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || event.selected_blocks || [];
  const blockCfg = event.block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(38, 55%, 55%)"; // gold default for classic
  const maxCompanions = blockCfg.max_companions ?? 5;

  const bgIvory = "hsl(40, 30%, 97%)";
  const bgCream = theme?.secondary || "hsl(38, 25%, 94%)";
  const textDark = theme?.accent || "hsl(30, 15%, 20%)";
  const location = event.ceremony_address || event.address || event.location_name || "";

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', serif` : "'Cormorant Garamond', 'Playfair Display', serif", backgroundColor: bgIvory, color: textDark }}>
      <link href={`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=${encodeURIComponent(theme?.font || 'Cormorant Garamond')}:wght@300;400;500;600;700&family=Lato:wght@300;400;500&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <EnvelopeIntro names={names} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} tapLabel={el?.tapToOpen} />}

      {showContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          {/* Hero – Full-screen centered, formal elegance */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {event.hero_image_url ? (
              <>
                <img src={event.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bgCream} 0%, hsl(38 30% 85%) 100%)` }} />
            )}
            <motion.div className="relative text-center px-8 max-w-lg z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              {/* Monogram */}
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 md:mb-8 rounded-full flex items-center justify-center" style={{ border: `2px solid ${event.hero_image_url ? 'rgba(255,255,255,0.7)' : accent}` }}>
                <span className="text-xl md:text-2xl font-light tracking-widest" style={{ color: event.hero_image_url ? 'rgba(255,255,255,0.9)' : accent, fontFamily: "'Cormorant Garamond', serif" }}>{initials}</span>
              </div>
              <p className="text-xs tracking-[0.4em] uppercase mb-4 md:mb-6" style={{ color: event.hero_image_url ? 'rgba(255,255,255,0.7)' : accent }}>{el?.weMarry || t("event.weMarry")}</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 leading-tight" style={{ fontFamily: "'Great Vibes', cursive", color: event.hero_image_url ? '#fff' : textDark }}>{names}</h1>
              <ClassicOrnament color={event.hero_image_url ? 'rgba(255,255,255,0.5)' : accent} />
              <p className="text-base md:text-lg tracking-[0.15em] mt-3 md:mt-4" style={{ color: event.hero_image_url ? 'rgba(255,255,255,0.85)' : textDark }}>{formattedDate}</p>
              {event.description && <p className="text-xs md:text-sm mt-3 md:mt-4 tracking-wider italic" style={{ color: event.hero_image_url ? 'rgba(255,255,255,0.6)' : "hsl(30, 10%, 50%)" }}>{event.description}</p>}
            </motion.div>
            <button className="absolute bottom-8 left-1/2 -translate-x-1/2" onClick={() => document.getElementById("countdown-classic")?.scrollIntoView({ behavior: "smooth" })} style={{ color: event.hero_image_url ? 'rgba(255,255,255,0.5)' : "hsl(30, 8%, 50%)" }}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}><ChevronDown className="w-6 h-6" /></motion.div>
            </button>
          </section>

          {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}


          {/* Countdown – formal, centered */}
          <section id="countdown-classic" className="py-14 md:py-28 relative" style={{ backgroundColor: bgIvory }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="text-xs tracking-[0.3em] uppercase mb-3 md:mb-4" style={{ color: accent }}>{el?.countdown || t("event.countdown")}</p>
              <h2 className="text-xl md:text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{el?.countdownSub || t("event.countdownSub")}</h2>
              <ClassicOrnament color={accent} />
              <div className="mt-6 md:mt-10">
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} variant="classic" accentColor={accent} />
              </div>
            </div>
          </section>

          {/* Story – full-width with double border frame */}
          {event.story_text && (
            <section className="py-16 md:py-28 relative" style={{ backgroundColor: bgCream }}>
              <div className="max-w-2xl mx-auto px-4">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="p-6 md:p-14 relative"
                  style={{ border: `1px solid ${colorWithAlpha(accent, 0.3)}` }}>
                  {/* Inner border */}
                  <div className="absolute inset-2 md:inset-3 pointer-events-none" style={{ border: `1px solid ${colorWithAlpha(accent, 0.15)}` }} />
                  <div className="text-center relative">
                    <h2 className="text-xl md:text-3xl mb-4 md:mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{el?.ourStory || t("event.ourStory")}</h2>
                    <ClassicOrnament color={accent} />
                    <p className="text-sm md:text-base leading-[1.8] md:leading-[2] whitespace-pre-line mt-5 md:mt-8" style={{ color: "hsl(30, 10%, 40%)" }}>{event.story_text}</p>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {hasBlock("-illustration") && <CustomIllustrationSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}
          {hasBlock("-slideshow") && <SlideshowSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}

          {/* Schedule */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <section className="py-14 md:py-24 relative" style={{ backgroundColor: bgIvory }}>
              <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                  <p className="text-xs tracking-[0.3em] uppercase mb-2 md:mb-3" style={{ color: accent }}>{el?.timeline || t("event.timeline")}</p>
                  <ClassicOrnament color={accent} />
                </div>
                <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
              </div>
            </section>
          )}

          {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
          {hasBlock("-dresscode") && <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />}

          <ClassicOrnament color={accent} />

          {/* Details – symmetrical card grid with borders */}
          <section className="py-16 md:py-28 relative" style={{ backgroundColor: bgCream }}>
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-10 md:mb-16">
                <h2 className="text-xl md:text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{el?.details || t("event.details")}</h2>
                <ClassicOrnament color={accent} />
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="text-center p-5 md:p-8 relative"
                  style={{ border: `1px solid ${colorWithAlpha(accent, 0.25)}` }}>
                  <div className="absolute inset-2 pointer-events-none" style={{ border: `1px solid ${colorWithAlpha(accent, 0.1)}` }} />
                  <Church className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4" style={{ color: accent }} />
                  <h3 className="text-lg md:text-xl mb-2 md:mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{el?.ceremony || t("event.ceremony")}</h3>
                  <p className="text-sm font-medium mb-1">{event.ceremony_location || event.location_name || "—"}</p>
                  <p className="text-sm" style={{ color: "hsl(30, 10%, 50%)" }}>{event.ceremony_address || event.address || ""}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="text-center p-5 md:p-8 relative"
                  style={{ border: `1px solid ${colorWithAlpha(accent, 0.25)}` }}>
                  <div className="absolute inset-2 pointer-events-none" style={{ border: `1px solid ${colorWithAlpha(accent, 0.1)}` }} />
                  <Wine className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4" style={{ color: accent }} />
                  <h3 className="text-lg md:text-xl mb-2 md:mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{el?.reception || t("event.reception")}</h3>
                  <p className="text-sm font-medium mb-1">{event.reception_location || event.location_name || "—"}</p>
                  <p className="text-sm" style={{ color: "hsl(30, 10%, 50%)" }}>{event.reception_address || event.address || ""}</p>
                </motion.div>
              </div>
              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <div className="text-center mt-10"><p className="text-sm italic" style={{ color: "hsl(30, 10%, 50%)" }}>
                  <Baby className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  {event.children_welcome ? (el?.childrenWelcome || t("event.childrenWelcome")) : (el?.adultsOnly || t("event.adultsOnly"))}
                </p></div>
              )}
              {(event.address || event.ceremony_address) && (
                <div className="mt-12 max-w-xl mx-auto"><GoogleMapsEmbed address={event.ceremony_address || event.address || ""} /></div>
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

          {event.rsvp_enabled && <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="wedding" lang={lang} maxCompanions={maxCompanions} />}

          {/* Footer – formal */}
          <footer className="py-14 md:py-24 text-center" style={{ backgroundColor: bgIvory }}>
            <div className="max-w-md mx-auto px-4">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ border: `1px solid ${accent}` }}>
                <span className="text-lg tracking-widest" style={{ color: accent, fontFamily: "'Cormorant Garamond', serif" }}>{initials}</span>
              </div>
              <h2 className="text-3xl mb-2" style={{ fontFamily: "'Great Vibes', cursive", color: textDark }}>{names}</h2>
              <p className="text-xs tracking-[0.2em] uppercase mt-2 mb-4" style={{ color: "hsl(30, 10%, 50%)" }}>{formattedDate}</p>
              <ClassicOrnament color={accent} />
              <p className="text-sm italic mt-4 mb-8" style={{ color: "hsl(30, 10%, 50%)" }}>{el?.celebration || t("event.celebration")}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={buildGoogleCalUrl(names, event.event_date, event.event_time, location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm tracking-wider" style={{ border: `1px solid ${colorWithAlpha(accent, 0.3)}`, color: textDark }}>
                  <CalendarPlus className="w-4 h-4" style={{ color: accent }} /> Google Calendar
                </a>
                <a href={buildIcsBlob(names, event.event_date, event.event_time, location)} download={`${names.replace(/\s/g, "_")}.ics`} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm tracking-wider" style={{ border: `1px solid ${colorWithAlpha(accent, 0.3)}`, color: textDark }}>
                  <CalendarPlus className="w-4 h-4" style={{ color: accent }} /> Apple / Outlook
                </a>
              </div>
              <p className="text-[10px] tracking-widest uppercase mt-12" style={{ color: "hsl(30, 10%, 70%)" }}>Made with ♥ by celebra</p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
    </GuestNameProvider>
  );
};

export default WeddingClassicPage;
