import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Calendar, Shirt, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";
import BadgeScanIntro from "./BadgeScanIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { GuestNameProvider } from "@/hooks/useGuestName";

import { PremiumEventData, PremiumTheme } from "./PremiumWeddingPage";
import { colorWithAlpha } from "@/lib/color-utils";

import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import AgendaSection from "@/components/blocks/AgendaSection";
import ProductsSection from "@/components/blocks/ProductsSection";
import SponsorsSection from "@/components/blocks/SponsorsSection";
import BackgroundMusicSection from "@/components/blocks/BackgroundMusicSection";
import VideoMessageSection from "@/components/blocks/VideoMessageSection";

/* Monoline rule divider */
const RuleDivider = ({ color }: { color: string }) => (
  <div className="flex items-center gap-4 my-6">
    <div className="flex-1 h-px" style={{ backgroundColor: colorWithAlpha(color, 0.15) }} />
    <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: color }} />
    <div className="flex-1 h-px" style={{ backgroundColor: colorWithAlpha(color, 0.15) }} />
  </div>
);

const PremiumCorporatePage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "#2563EB";
  const bg = "#FAFAFA";
  const cardBg = "#FFFFFF";
  const darkText = "#111111";
  const maxCompanions = blockCfg.max_companions ?? 5;

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Inter', 'SF Pro Display', system-ui, sans-serif", backgroundColor: bg, color: darkText }}>
      <link href={`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=${encodeURIComponent(theme?.font || 'Inter')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <BadgeScanIntro title={event.title} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} accentColor={accent} />}

      {showContent && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

        {/* ─── HERO ─── Ultra-clean, structured, Apple-event-style */}
        <section className="relative min-h-[90vh] flex items-end overflow-hidden pb-20" style={{
          background: event.hero_image_url ? undefined : `linear-gradient(180deg, ${cardBg} 0%, ${bg} 100%)`,
        }}>
          {event.hero_image_url ? (
            <>
              <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)" }} />
            </>
          ) : (
            <>
              {/* Blueprint grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)` }} />
            </>
          )}

          <motion.div
            className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Meta info bar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium tracking-wider uppercase" style={{ color: event.hero_image_url ? "#fff" : accent, border: `1px solid ${event.hero_image_url ? "rgba(255,255,255,0.2)" : colorWithAlpha(accent, 0.2)}`, fontFamily: "'JetBrains Mono', monospace" }}>
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium tracking-wider uppercase" style={{ color: event.hero_image_url ? "#fff" : accent, border: `1px solid ${event.hero_image_url ? "rgba(255,255,255,0.2)" : colorWithAlpha(accent, 0.2)}`, fontFamily: "'JetBrains Mono', monospace" }}>
                <Clock className="w-3.5 h-3.5" />
                {event.event_time}{lang === "en" ? "" : " Uhr"}
              </span>
            </div>

            <p className="text-xs font-medium tracking-[0.3em] uppercase mb-4" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.5)" : colorWithAlpha(darkText, 0.4) }}>
              {el?.youreInvited || t("event.youreInvited")}
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6" style={{ color: event.hero_image_url ? "#fff" : darkText, letterSpacing: "-0.02em" }}>
              {event.title}
            </h1>

            {event.description && (
              <p className="text-lg md:text-xl max-w-2xl font-light leading-relaxed" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.6)" : colorWithAlpha(darkText, 0.5) }}>
                {event.description}
              </p>
            )}
          </motion.div>
        </section>

        {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

        {/* ─── COUNTDOWN ─── Clean numbers on structured grid */}
        <section className="py-20 md:py-28 relative" style={{ backgroundColor: cardBg }}>
          <div className="max-w-4xl mx-auto px-8 md:px-16">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: colorWithAlpha(darkText, 0.4) }}>
                {el?.countdown || t("event.countdown")}
              </h2>
              <div className="flex-1 h-px mx-8" style={{ backgroundColor: colorWithAlpha(darkText, 0.08) }} />
            </div>
            <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        {event.story_text && (
          <section className="py-20 md:py-28 relative" style={{ backgroundColor: bg }}>
            <div className="max-w-4xl mx-auto px-8 md:px-16">
              <div className="grid md:grid-cols-[200px_1fr] gap-12">
                <div>
                  <h2 className="text-xs font-medium tracking-[0.25em] uppercase sticky top-24" style={{ color: colorWithAlpha(darkText, 0.4) }}>
                    {el?.agenda || t("event.agenda")}
                  </h2>
                </div>
                <div>
                  <p className="text-lg md:text-xl leading-[1.8] font-light whitespace-pre-line" style={{ color: colorWithAlpha(darkText, 0.7) }}>
                    {event.story_text}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── SCHEDULE ─── */}
        {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
          <section className="py-20 md:py-28 relative" style={{ backgroundColor: cardBg }}>
            <div className="max-w-4xl mx-auto px-8 md:px-16">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: colorWithAlpha(darkText, 0.4) }}>
                  {el?.timeline || t("event.timeline")}
                </h2>
                <div className="flex-1 h-px mx-8" style={{ backgroundColor: colorWithAlpha(darkText, 0.08) }} />
              </div>
              <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
            </div>
          </section>
        )}

        {hasBlock("-agenda") && <AgendaSection agenda={blockCfg.agenda} accentColor={accent} lang={lang} />}
        {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}

        {/* ─── DETAILS ─── Grid-based info cards */}
        <section className="py-20 md:py-28 relative" style={{ backgroundColor: bg }}>
          <div className="max-w-4xl mx-auto px-8 md:px-16">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: colorWithAlpha(darkText, 0.4) }}>
                {el?.details || t("event.details")}
              </h2>
              <div className="flex-1 h-px mx-8" style={{ backgroundColor: colorWithAlpha(darkText, 0.08) }} />
            </div>
            <div className={`grid gap-6 ${event.dress_code ? "md:grid-cols-2" : "md:grid-cols-1 max-w-lg"}`}>
              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 relative"
                style={{ backgroundColor: cardBg, border: `1px solid ${colorWithAlpha(darkText, 0.06)}` }}
              >
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: accent }} />
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: colorWithAlpha(accent, 0.08) }}>
                    <MapPin className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: darkText }}>
                      {el?.location || t("event.location")}
                    </h3>
                    <p className="text-sm font-light" style={{ color: colorWithAlpha(darkText, 0.6) }}>{event.location_name || "—"}</p>
                    <p className="text-sm font-light mt-0.5" style={{ color: colorWithAlpha(darkText, 0.4) }}>{event.address || ""}</p>
                  </div>
                </div>
              </motion.div>

              {/* Dress Code */}
              {event.dress_code && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 relative"
                  style={{ backgroundColor: cardBg, border: `1px solid ${colorWithAlpha(darkText, 0.06)}` }}
                >
                  <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: accent }} />
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: colorWithAlpha(accent, 0.08) }}>
                      <Shirt className="w-4 h-4" style={{ color: accent }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: darkText }}>
                        {el?.dressCode || t("event.dressCode")}
                      </h3>
                      <p className="text-sm font-light" style={{ color: colorWithAlpha(darkText, 0.6) }}>{event.dress_code}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            {event.address && (
              <div className="mt-10 max-w-xl" style={{ border: `1px solid ${colorWithAlpha(darkText, 0.06)}` }}>
                <GoogleMapsEmbed address={event.address} />
              </div>
            )}
          </div>
        </section>

        {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
          <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
        )}

        {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="corporate" />}
        {hasBlock("-products") && <ProductsSection products={blockCfg.products} accentColor={accent} lang={lang} />}
        {hasBlock("-sponsors") && <SponsorsSection sponsors={blockCfg.sponsors} accentColor={accent} lang={lang} />}

        {event.rsvp_enabled && (
          <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="corporate" lang={lang} maxCompanions={maxCompanions} />
        )}

        {/* ─── FOOTER ─── Minimal structured */}
        <footer className="py-16 relative" style={{ backgroundColor: cardBg, borderTop: `1px solid ${colorWithAlpha(darkText, 0.06)}` }}>
          <div className="max-w-4xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-semibold" style={{ color: darkText }}>{event.title}</h2>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: colorWithAlpha(darkText, 0.35), fontFamily: "'JetBrains Mono', monospace" }}>
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

export default PremiumCorporatePage;
