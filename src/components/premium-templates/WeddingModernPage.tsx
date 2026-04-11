/**
 * MODERN LOVE – Bold, minimal, asymmetric
 * 
 * Layout DNA:
 * - Large sans-serif typography as hero element
 * - Asymmetric, off-center layouts
 * - No ornaments – whitespace and contrast do the work
 * - Diagonal section cuts
 * - Monochrome palette with single accent pop
 * - Full-bleed image sections
 * - Horizontal timeline instead of vertical
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, ChevronDown, Baby, CalendarPlus } from "lucide-react";
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
import { type PremiumEventData, type PremiumTheme } from "./PremiumWeddingPage";
import { buildGoogleCalUrl, buildIcsBlob } from "./calendarUtils";

/* Diagonal section cut */
const DiagonalCut = ({ from, to }: { from: string; to: string }) => (
  <div className="relative w-full -my-px" style={{ height: "60px" }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <polygon points="0,0 1440,0 1440,15 0,60" fill={from} />
      <polygon points="0,60 1440,15 1440,60" fill={to} />
    </svg>
  </div>
);

const WeddingModernPage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete, introContained = false }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void; introContained?: boolean }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const names = event.title;
  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || event.selected_blocks || [];
  const blockCfg = event.block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(0, 0%, 20%)";
  const maxCompanions = blockCfg.max_companions ?? 5;

  const bgWhite = "#ffffff";
  const bgOff = theme?.secondary || "hsl(0, 0%, 96%)";
  const bgDark = "hsl(0, 0%, 8%)";
  const textDark = theme?.accent || "hsl(0, 0%, 12%)";
  const location = event.ceremony_address || event.address || event.location_name || "";

  // Split names for oversized typography
  const nameParts = names.split(/\s*[&+]\s*|\s+und\s+|\s+and\s+/i);
  const name1 = nameParts[0] || names;
  const name2 = nameParts[1] || "";

  return (
    <GuestNameProvider>
    <div className="relative min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Montserrat', 'DM Sans', sans-serif", backgroundColor: bgWhite, color: textDark }}>
      <link href={`https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&family=${encodeURIComponent(theme?.font || 'Montserrat')}:wght@200;300;400;500;600;700;800;900&family=Lato:wght@300;400;500&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <EnvelopeIntro names={names} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} tapLabel={el?.tapToOpen} contained={introContained} />}

      {showContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Hero – Bold oversized typography with image behind */}
          <section className="relative h-[100dvh] min-h-[100dvh] flex items-end overflow-hidden" style={{ backgroundColor: bgDark }}>
            {event.hero_image_url ? (
              <>
                <div className="absolute inset-x-0 top-[-6vh] h-[106dvh] sm:inset-0 sm:h-full"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, hsl(0 0% 15%) 0%, hsl(0 0% 5%) 100%)` }} />
            )}
            <motion.div className="relative z-10 w-full px-5 md:px-16 pb-12 md:pb-24 sm:translate-y-0 -translate-y-[3vh]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4 md:mb-6 text-white/50">{el?.weMarry || t("event.weMarry")}</p>
              {/* Oversized names – stacked, left-aligned */}
              <h1 className="text-[2.75rem] md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tight text-white uppercase">
                {name1}
              </h1>
              {name2 && (
                <>
                  <span className="text-xl md:text-4xl font-light tracking-[0.3em] text-white/40 block my-1 md:my-4">&</span>
                  <h1 className="text-[2.75rem] md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tight text-white uppercase">
                    {name2}
                  </h1>
                </>
              )}
              <div className="flex items-center gap-3 md:gap-4 mt-5 md:mt-8">
                <div className="h-px flex-1 max-w-[80px] md:max-w-[120px]" style={{ backgroundColor: accent }} />
                <p className="text-xs md:text-sm tracking-[0.2em] text-white/60">{formattedDate}</p>
              </div>
              {event.description && <p className="text-xs md:text-sm mt-3 md:mt-4 text-white/40 max-w-md">{event.description}</p>}
            </motion.div>
            <button className="absolute bottom-8 left-1/2 -translate-x-1/2" onClick={() => document.getElementById("countdown-modern")?.scrollIntoView({ behavior: "smooth" })}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}><ChevronDown className="w-6 h-6 text-white/40" /></motion.div>
            </button>
          </section>

          {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

          {/* Countdown – minimal, no decoration */}
          <section id="countdown-modern" className="py-14 md:py-28" style={{ backgroundColor: bgWhite }}>
            <div className="max-w-4xl mx-auto px-5 md:px-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: accent }}>{el?.countdown || t("event.countdown")}</p>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{el?.countdownSub || t("event.countdownSub")}</h2>
                </div>
                <div className="hidden" />
              </div>
              <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} variant="modern" accentColor={accent} />
            </div>
          </section>

          <DiagonalCut from={bgWhite} to={bgOff} />

          {/* Story – left-aligned, with a thick accent bar */}
          {event.story_text && (
            <section className="py-14 md:py-28" style={{ backgroundColor: bgOff }}>
              <div className="max-w-4xl mx-auto px-5 md:px-16">
                <div className="md:grid md:grid-cols-[auto_1fr] md:gap-12">
                  <div className="hidden md:block w-1 self-stretch rounded-full" style={{ backgroundColor: accent }} />
                  <div>
                    <p className="text-xs tracking-[0.3em] uppercase mb-2 md:mb-3" style={{ color: accent }}>{el?.ourStory || t("event.ourStory")}</p>
                    <p className="text-base md:text-xl leading-relaxed whitespace-pre-line" style={{ color: "hsl(0, 0%, 35%)" }}>{event.story_text}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {hasBlock("-illustration") && <CustomIllustrationSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}
          {hasBlock("-slideshow") && <SlideshowSection accentColor={accent} lang={lang} blockConfig={blockCfg} />}

          {/* Schedule – horizontal on desktop, vertical on mobile */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <>
              <DiagonalCut from={bgOff} to={bgWhite} />
              <section className="py-14 md:py-24" style={{ backgroundColor: bgWhite }}>
                <div className="max-w-4xl mx-auto px-5 md:px-16">
                  <p className="text-xs tracking-[0.3em] uppercase mb-6 md:mb-8" style={{ color: accent }}>{el?.timeline || t("event.timeline")}</p>
                  {/* Horizontal on desktop */}
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="h-px w-full" style={{ backgroundColor: "hsl(0,0%,85%)" }} />
                      <div className="flex justify-between mt-6">
                        {(event.schedule as Array<{ time: string; label: string }>).map((item, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center flex-1 relative">
                            <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
                            <p className="text-2xl font-bold tracking-tight">{item.time}</p>
                            <p className="text-sm mt-1" style={{ color: "hsl(0,0%,50%)" }}>{item.label}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Vertical on mobile */}
                  <div className="md:hidden">
                    <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
                  </div>
                </div>
              </section>
            </>
          )}

          {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}
          {hasBlock("-dresscode") && <DressCodeMFSection dressCode={{ male: blockCfg.dresscode_male, female: blockCfg.dresscode_female }} accentColor={accent} lang={lang} />}

          <DiagonalCut from={bgWhite} to={bgOff} />

          {/* Details – stacked full-width cards */}
          <section className="py-14 md:py-28" style={{ backgroundColor: bgOff }}>
            <div className="max-w-4xl mx-auto px-5 md:px-16">
              <p className="text-xs tracking-[0.3em] uppercase mb-6 md:mb-10" style={{ color: accent }}>{el?.details || t("event.details")}</p>
              <div className="space-y-6">
                {/* Ceremony */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 md:p-8"
                  style={{ backgroundColor: bgWhite }}>
                  <div className="flex-shrink-0">
                    <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: accent }}>{el?.ceremony || t("event.ceremony")}</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-border" />
                  <div>
                    <p className="font-medium">{event.ceremony_location || event.location_name || "—"}</p>
                    <p className="text-sm" style={{ color: "hsl(0,0%,50%)" }}>{event.ceremony_address || event.address || ""}</p>
                  </div>
                </motion.div>
                {/* Reception */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 md:p-8"
                  style={{ backgroundColor: bgWhite }}>
                  <div className="flex-shrink-0">
                    <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: accent }}>{el?.reception || t("event.reception")}</p>
                    
                  </div>
                  <div className="hidden md:block w-px h-12 bg-border" />
                  <div>
                    <p className="font-medium">{event.reception_location || event.location_name || "—"}</p>
                    <p className="text-sm" style={{ color: "hsl(0,0%,50%)" }}>{event.reception_address || event.address || ""}</p>
                  </div>
                </motion.div>
              </div>
              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <p className="text-sm mt-8" style={{ color: "hsl(0,0%,50%)" }}>
                  <Baby className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  {event.children_welcome ? (el?.childrenWelcome || t("event.childrenWelcome")) : (el?.adultsOnly || t("event.adultsOnly"))}
                </p>
              )}
              {(event.address || event.ceremony_address) && (
                <div className="mt-10"><GoogleMapsEmbed address={event.ceremony_address || event.address || ""} /></div>
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

          {/* Footer – bold and minimal */}
          <footer className="py-16 md:py-32 relative" style={{ backgroundColor: bgDark }}>
            <div className="max-w-4xl mx-auto px-5 md:px-16 text-white">
              <h2 className="text-3xl md:text-7xl font-bold tracking-tight uppercase leading-none">{name1}</h2>
              {name2 && (
                <>
                  <span className="text-xl font-light tracking-[0.3em] text-white/30 block my-3">&</span>
                  <h2 className="text-3xl md:text-7xl font-bold tracking-tight uppercase leading-none">{name2}</h2>
                </>
              )}
              <div className="flex items-center gap-4 mt-8 mb-10">
                <div className="h-px w-16" style={{ backgroundColor: accent }} />
                <p className="text-sm tracking-[0.2em] text-white/50">{formattedDate}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={buildGoogleCalUrl(names, event.event_date, event.event_time, location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wider border border-white/20 text-white hover:bg-white/10 transition-colors">
                  <CalendarPlus className="w-4 h-4" /> Google Calendar
                </a>
                <a href={buildIcsBlob(names, event.event_date, event.event_time, location)} download={`${names.replace(/\s/g, "_")}.ics`} className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wider border border-white/20 text-white hover:bg-white/10 transition-colors">
                  <CalendarPlus className="w-4 h-4" /> Apple / Outlook
                </a>
              </div>
              <p className="text-[10px] tracking-widest uppercase mt-16 text-white/20">Made with ♥ by celebra</p>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
    </GuestNameProvider>
  );
};

export default WeddingModernPage;
