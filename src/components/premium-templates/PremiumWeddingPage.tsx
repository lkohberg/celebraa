import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, ChevronDown, Baby, Sparkles, Church, Wine, CalendarPlus } from "lucide-react";
import { useTranslation } from "@/i18n";
import EnvelopeIntro from "./EnvelopeIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import WeddingSectionDivider, { type WeddingStyle } from "./WeddingSectionDivider";
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

/* Decorative leaf SVG ornament */
const FloralDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-2">
    <svg width="40" height="12" viewBox="0 0 40 12" fill="none" style={{ opacity: 0.25 }}>
      <path d="M0 6C8 2 16 2 20 6C24 2 32 2 40 6" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="20" cy="6" r="2" fill={color} />
    </svg>
  </div>
);

/** Detect wedding style from template_id or font */
const detectWeddingStyle = (theme?: PremiumTheme): WeddingStyle => {
  if (!theme?.font) return "floral";
  const font = theme.font.toLowerCase();
  if (font.includes("playfair") || font.includes("cormorant")) return "classic";
  if (font.includes("montserrat") || font.includes("raleway") || font.includes("poppins")) return "modern";
  return "floral";
};

/** Add-to-calendar URL generators */
const buildGoogleCalUrl = (title: string, date: string, time: string, location?: string) => {
  const [y, m, d] = date.split("-");
  const [h, min] = (time || "12:00").split(":");
  const start = `${y}${m}${d}T${h}${min}00`;
  const endH = String(Math.min(23, parseInt(h) + 4)).padStart(2, "0");
  const end = `${y}${m}${d}T${endH}${min}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    ...(location ? { location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

const buildIcsBlob = (title: string, date: string, time: string, location?: string) => {
  const [y, m, d] = date.split("-");
  const [h, min] = (time || "12:00").split(":");
  const start = `${y}${m}${d}T${h}${min}00`;
  const endH = String(Math.min(23, parseInt(h) + 4)).padStart(2, "0");
  const end = `${y}${m}${d}T${endH}${min}00`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
    `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
};

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
  const wStyle = detectWeddingStyle(theme);

  // Section colors
  const bgLight = "hsl(30, 30%, 98%)";
  const bgWarm = theme?.secondary || "hsl(30, 33%, 96%)";
  const location = event.ceremony_address || event.address || event.location_name || "";

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Lato', 'DM Sans', sans-serif", backgroundColor: bgWarm, color: theme?.accent || "hsl(30, 10%, 25%)" }}>
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
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(340 30% 90%) 0%, hsl(30 35% 93%) 50%, hsl(150 15% 88%) 100%)" }} />
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${softPink}, transparent)` }} />
                <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
              </>
            )}
            <motion.div className="relative z-10 text-center px-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.8)" : "hsl(30, 8%, 50%)" }}>{el?.weMarry || t("event.weMarry")}</p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6" style={{ fontFamily: "'Great Vibes', cursive", color: event.hero_image_url ? "white" : "hsl(30, 10%, 25%)", lineHeight: 1.2 }}>{names}</h1>
              <FloralDivider color={event.hero_image_url ? "rgba(255,255,255,0.5)" : "hsl(30, 20%, 70%)"} />
              <p className="text-xl md:text-2xl italic mt-4" style={{ fontFamily: "var(--font-display)", color: event.hero_image_url ? "rgba(255,255,255,0.9)" : "hsl(30, 10%, 35%)" }}>{formattedDate}</p>
              {event.description && <p className="font-body text-sm mt-3 tracking-[0.15em] uppercase" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.7)" : "hsl(30, 8%, 50%)" }}>{event.description}</p>}
            </motion.div>
            <button className="absolute bottom-8 left-1/2 -translate-x-1/2" onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })} style={{ color: event.hero_image_url ? "rgba(255,255,255,0.6)" : "hsl(30, 8%, 50%)" }}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}><ChevronDown className="w-6 h-6" /></motion.div>
            </button>
          </section>

          {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

          {/* Section divider: hero → countdown */}
          <WeddingSectionDivider fromColor={bgWarm} toColor={bgLight} style={wStyle} accentColor={accent} />

          {/* Countdown */}
          <section id="countdown" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgLight }}>
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
            <div className="relative max-w-3xl mx-auto px-4 text-center">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">{el?.countdown || t("event.countdown")}</p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{el?.countdownSub || t("event.countdownSub")}</h2>
              <FloralDivider color={accent} />
              <div className="mt-10">
                <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} variant={wStyle} accentColor={accent} />
              </div>
            </div>
          </section>

          {/* Section divider: countdown → story */}
          {event.story_text && <WeddingSectionDivider fromColor={bgLight} toColor={bgWarm} style={wStyle} accentColor={accent} />}

          {/* Story */}
          {event.story_text && (
            <section className="py-28 relative overflow-hidden" style={{ backgroundColor: bgWarm }}>
              <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${softPink}, transparent)` }} />
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
              <div className="relative max-w-2xl mx-auto px-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: softPink }} />
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.ourStory || t("event.ourStory")}</h2>
                <FloralDivider color={softPink} />
                <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
              </div>
            </section>
          )}

          {hasBlock("-illustration") && <CustomIllustrationSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}
          {hasBlock("-slideshow") && <SlideshowSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}

          {/* Schedule Timeline */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <>
              <WeddingSectionDivider fromColor={bgLight} toColor={bgWarm} style={wStyle} accentColor={accent} />
              <section className="py-24 relative overflow-hidden" style={{ backgroundColor: bgWarm }}>
                <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
                <div className="relative max-w-3xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <Clock className="w-6 h-6 mx-auto mb-3" style={{ color: accent }} />
                    <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
                    <FloralDivider color={accent} />
                  </div>
                  <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
                </div>
              </section>
            </>
          )}

          {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
          {hasBlock("-dresscode") && (
            <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />
          )}

          {/* Section divider before details */}
          <WeddingSectionDivider fromColor={bgWarm} toColor={bgLight} style={wStyle} accentColor={accent} />

          {/* Details */}
          <section className="py-28 relative overflow-hidden" style={{ backgroundColor: bgLight }}>
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${softPink} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
            <div className="relative max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.details || t("event.details")}</h2>
                <FloralDivider color={softPink} />
              </div>
              <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
                {/* Ceremony card – with Church icon */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.15) }}>
                    <Church className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.ceremony || t("event.ceremony")}</h3>
                  <p className="font-body text-sm font-medium text-foreground mb-1">{event.ceremony_location || event.location_name || "—"}</p>
                  <p className="font-body text-sm text-muted-foreground">{event.ceremony_address || event.address || ""}</p>
                  {event.event_time && (
                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colorWithAlpha(accent, 0.1), color: accent }}>
                      <Clock className="w-3 h-3" />
                      {event.event_time}
                    </div>
                  )}
                </motion.div>
                {/* Reception card – with Wine icon */}
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-center p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(softPink, 0.2) }}>
                    <Wine className="w-6 h-6" style={{ color: "hsl(10, 50%, 55%)" }} />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.reception || t("event.reception")}</h3>
                  <p className="font-body text-sm font-medium text-foreground mb-1">{event.reception_location || event.location_name || "—"}</p>
                  <p className="font-body text-sm text-muted-foreground">{event.reception_address || event.address || ""}</p>
                </motion.div>
              </div>
              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/60 rounded-full border border-border/30">
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

          {/* Section divider before footer */}
          <WeddingSectionDivider fromColor={bgWarm} toColor={bgLight} style={wStyle} accentColor={accent} />

          {/* Footer */}
          <footer className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: bgLight }}>
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
            <div className="relative">
              <h2 className="text-4xl mb-3" style={{ fontFamily: "'Great Vibes', cursive", color: accent }}>{names}</h2>
              <FloralDivider color={accent} />
              <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase mt-3 mb-2">{formattedDate.replace(/\s/g, " · ")}</p>

              {/* Emotional closing text */}
              <p className="font-body text-base text-muted-foreground mt-4 mb-8 italic">
                {el?.celebration || t("event.celebration")} ♥
              </p>

              {/* Add to Calendar */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={buildGoogleCalUrl(names, event.event_date, event.event_time, location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/40 bg-card/60 backdrop-blur-sm text-sm font-body text-foreground hover:bg-card transition-colors shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4" style={{ color: accent }} />
                  Google Calendar
                </a>
                <a
                  href={buildIcsBlob(names, event.event_date, event.event_time, location)}
                  download={`${names.replace(/\s/g, "_")}.ics`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/40 bg-card/60 backdrop-blur-sm text-sm font-body text-foreground hover:bg-card transition-colors shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4" style={{ color: accent }} />
                  Apple / Outlook
                </a>
              </div>

              {/* Branding */}
              <p className="font-body text-[10px] text-muted-foreground/50 tracking-widest uppercase mt-10">
                Made with ♥ by celebra
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
