import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Building2, MapPin, Clock, Calendar, Shirt, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import BadgeScanIntro from "./BadgeScanIntro";
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

import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import AgendaSection from "@/components/blocks/AgendaSection";
import ProductsSection from "@/components/blocks/ProductsSection";
import SponsorsSection from "@/components/blocks/SponsorsSection";
import BackgroundMusicSection from "@/components/blocks/BackgroundMusicSection";
import VideoMessageSection from "@/components/blocks/VideoMessageSection";

const CorpDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-2">
    <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: color, opacity: 0.35 }} />
    <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
  </div>
);

/* Frosted glass sticky navbar */
const FrostedNav = ({ title, accent, visible }: { title: string; accent: string; visible: boolean }) => (
  <motion.nav
    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
    style={{ backgroundColor: "rgba(255,255,255,0.85)", borderColor: colorWithAlpha(accent, 0.1) }}
    initial={{ y: -80 }}
    animate={{ y: visible ? 0 : -80 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.1) }}>
          <Building2 className="w-4 h-4" style={{ color: accent }} />
        </div>
        <span className="font-display text-sm font-semibold text-foreground">{title}</span>
      </div>
    </div>
  </motion.nav>
);

const PremiumCorporatePage = ({ event, theme, lang, showIntro = true, isDemo = false, onIntroComplete }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean; onIntroComplete?: () => void }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);
  const [showNav, setShowNav] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowNav(latest > 500);
  });

  const dateLocale = lang === "en" ? "en-US" : lang === "de" ? "de-AT" : (lang || "de-AT");
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(220, 50%, 35%)";
  const gold = theme?.accent || "hsl(43, 55%, 55%)";
  const maxCompanions = blockCfg.max_companions ?? 5;

  const bgLight = "hsl(220, 20%, 97%)";
  const bgCard = "hsl(220, 15%, 95%)";

  return (
    <GuestNameProvider>
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'DM Sans', sans-serif" }}>
      <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme?.font || 'DM Sans')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <BadgeScanIntro title={event.title} onOpen={() => { setShowContent(true); onIntroComplete?.(); }} accentColor={accent} />}

      {showContent && (
      <>
      <FrostedNav title={event.title} accent={accent} visible={showNav} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" style={{
        background: event.hero_image_url ? undefined
          : theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
          : "linear-gradient(135deg, hsl(220 40% 12%) 0%, hsl(220 50% 22%) 100%)",
      }}>
        {event.hero_image_url && (
          <>
            <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
          </>
        )}
        {!event.hero_image_url && (
          <>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
            {/* Animated grid lines */}
            <motion.div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`, backgroundSize: "120px 120px" }}
              animate={{ backgroundPosition: ["0 0", "0 120px"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute top-[10%] right-[10%] w-40 h-40 border border-white/5 rotate-45" />
            <div className="absolute bottom-[15%] left-[8%] w-24 h-24 border border-white/5 rotate-12" />
          </>
        )}
        <motion.div className="relative z-10 text-center px-4 max-w-3xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10">
            <Building2 className="w-8 h-8 text-white/70" />
          </div>
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4 text-white/60">{el?.youreInvited || t("event.youreInvited")}</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">{event.title}</h1>
          <CorpDivider color="rgba(255,255,255,0.4)" />
          {/* Badge pills for date/time */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/80 font-body text-sm border border-white/10">
              <Calendar className="w-4 h-4" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/80 font-body text-sm border border-white/10">
              <Clock className="w-4 h-4" /> {event.event_time}{lang === "en" ? "" : " Uhr"}
            </span>
            {event.location_name && (
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-white/80 font-body text-sm border border-white/10">
                <MapPin className="w-4 h-4" /> {event.location_name}
              </span>
            )}
          </div>
          {event.description && <p className="font-body text-white/60 mt-6 text-lg max-w-xl mx-auto">{event.description}</p>}
        </motion.div>
      </section>

      {hasBlock("-bgmusic") && <BackgroundMusicSection accentColor={accent} lang={lang} isDemo={isDemo} blockConfig={blockCfg} eventId={event.id} />}

      {/* Countdown */}
      <RevealSection variant="fade-wipe" className="py-24 relative overflow-hidden" style={{ backgroundColor: bgLight }} as="section">
        <SectionBackground variant="geometric" accentColor={accent} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">{el?.countdown || t("event.countdown")}</h2>
          <CorpDivider color={accent} />
          <div className="mt-10">
            <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} accentColor={accent} />
          </div>
        </div>
      </RevealSection>

      {/* About */}
      {event.story_text && (
        <RevealSection variant="fade" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgCard }} as="section">
          <SectionBackground variant="geometric" accentColor={accent} />
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.agenda || t("event.agenda")}</h2>
            <CorpDivider color={accent} />
            <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
          </div>
        </RevealSection>
      )}

      {/* Schedule Timeline */}
      {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
        <RevealSection variant="fade-wipe" className="py-20 relative overflow-hidden" style={{ backgroundColor: bgLight }} as="section">
          <SectionBackground variant="geometric" accentColor={accent} />
          <div className="relative max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(accent, 0.1) }}>
                <Clock className="w-6 h-6" style={{ color: accent }} />
              </div>
              <h2 className="font-display text-2xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
              <CorpDivider color={accent} />
            </div>
            <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
          </div>
        </RevealSection>
      )}

      {hasBlock("-agenda") && <AgendaSection agenda={blockCfg.agenda} accentColor={accent} lang={lang} />}
      {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}

      {/* Details — 2-column asymmetric layout */}
      <RevealSection variant="fade-up" className="py-28 relative overflow-hidden" style={{ backgroundColor: bgCard }} as="section">
        <SectionBackground variant="geometric" accentColor={accent} />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.details || t("event.details")}</h2>
            <CorpDivider color={accent} />
          </div>
          <div className={`grid gap-8 max-w-3xl mx-auto ${event.dress_code ? "md:grid-cols-5" : "md:grid-cols-1 max-w-lg"}`}>
            {/* Location - takes 3/5 width */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className={`${event.dress_code ? "md:col-span-3" : ""} p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm`}>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(accent, 0.1) }}>
                  <MapPin className="w-6 h-6" style={{ color: accent }} />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xl text-foreground mb-2">{el?.location || t("event.location")}</h3>
                  <p className="font-body text-sm text-muted-foreground">{event.location_name || "—"}</p>
                  <p className="font-body text-sm text-muted-foreground">{event.address || ""}</p>
                </div>
              </div>
            </motion.div>
            {/* Dresscode - takes 2/5 width */}
            {event.dress_code && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }} className="md:col-span-2 p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: colorWithAlpha(accent, 0.1) }}>
                  <Shirt className="w-6 h-6" style={{ color: accent }} />
                </div>
                <h3 className="font-display text-lg text-foreground mb-1">{el?.dressCode || t("event.dressCode")}</h3>
                <p className="font-body text-sm text-muted-foreground">{event.dress_code}</p>
              </motion.div>
            )}
          </div>
          {event.address && (
            <div className="mt-12 max-w-xl mx-auto"><GoogleMapsEmbed address={event.address} /></div>
          )}
        </div>
      </RevealSection>

      {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
        <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
      )}

      {hasBlock("-videomsg") && <VideoMessageSection accentColor={accent} lang={lang} blockConfig={blockCfg} variant="corporate" />}
      {hasBlock("-products") && <ProductsSection products={blockCfg.products} accentColor={accent} lang={lang} />}
      {hasBlock("-sponsors") && <SponsorsSection sponsors={blockCfg.sponsors} accentColor={accent} lang={lang} />}

      {event.rsvp_enabled && (
        <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="corporate" lang={lang} maxCompanions={maxCompanions} accentColor={accent} />
      )}

      {/* Footer */}
      <RevealSection variant="fade" className="py-20 text-center relative overflow-hidden" style={{ backgroundColor: bgLight }} as="footer">
        <SectionBackground variant="geometric" accentColor={accent} />
        <div className="relative">
          <h2 className="font-display text-2xl text-foreground mb-2">{event.title}</h2>
          <CorpDivider color={accent} />
          <p className="font-body text-sm text-muted-foreground mt-3">{formattedDate}</p>
        </div>
      </RevealSection>
      </motion.div>
      </>
      )}
    </div>
    </GuestNameProvider>
  );
};

export default PremiumCorporatePage;
