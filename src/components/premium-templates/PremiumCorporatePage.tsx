import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Clock, Calendar, Shirt, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";
import BadgeScanIntro from "./BadgeScanIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

import { PremiumEventData, PremiumTheme } from "./PremiumWeddingPage";

import FoodMenuSection from "@/components/blocks/FoodMenuSection";
import AgendaSection from "@/components/blocks/AgendaSection";
import ProductsSection from "@/components/blocks/ProductsSection";
import SponsorsSection from "@/components/blocks/SponsorsSection";

const CorpDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-2">
    <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
    <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color, opacity: 0.3 }} />
    <div className="w-10 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
  </div>
);

const PremiumCorporatePage = ({ event, theme, lang, showIntro = true, isDemo = false }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang; showIntro?: boolean; isDemo?: boolean }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(!showIntro);

  const formattedDate = new Date(event.event_date).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

  const selectedBlocks = event.selectedBlocks || (event as any).selected_blocks || [];
  const blockCfg = (event as any).block_config || {};
  const hasBlock = (suffix: string) => selectedBlocks.some((id: string) => id.endsWith(suffix));
  const accent = theme?.primary || "hsl(220, 50%, 35%)";
  const gold = theme?.accent || "hsl(43, 55%, 55%)";

  return (
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'DM Sans', sans-serif" }}>
      <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme?.font || 'DM Sans')}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />

      {showIntro && !showContent && <BadgeScanIntro title={event.title} onOpen={() => setShowContent(true)} accentColor={accent} />}

      {showContent && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" style={{
        background: event.hero_image_url ? undefined
          : theme ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
          : "linear-gradient(135deg, hsl(220 40% 12%) 0%, hsl(220 50% 22%) 100%)",
      }}>
        {event.hero_image_url && (
          <>
            <div className="absolute inset-0"><img src={event.hero_image_url} alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
          </>
        )}
        {/* Geometric decorative elements */}
        {!event.hero_image_url && (
          <>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
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
          <div className="flex items-center justify-center gap-6 text-white/70 font-body text-sm mt-4">
            <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full"><Calendar className="w-4 h-4" /> {formattedDate}</span>
            <span className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full"><Clock className="w-4 h-4" /> {event.event_time} Uhr</span>
          </div>
          {event.description && <p className="font-body text-white/60 mt-6 text-lg max-w-xl mx-auto">{event.description}</p>}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-24 relative overflow-hidden bg-card">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">{el?.countdown || t("event.countdown")}</h2>
          <CorpDivider color={accent} />
          <div className="mt-10">
            <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
          </div>
        </div>
      </section>

      {/* About */}
      {event.story_text && (
        <section className="py-28 relative overflow-hidden bg-background">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${accent}, transparent)` }} />
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{el?.agenda || t("event.agenda")}</h2>
            <CorpDivider color={accent} />
            <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line mt-8">{event.story_text}</p>
          </div>
        </section>
      )}

      {/* Schedule Timeline */}
      {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
        <section className="py-20 relative overflow-hidden bg-background">
          <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
          <div className="relative max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${accent}15` }}>
                <Clock className="w-6 h-6" style={{ color: accent }} />
              </div>
              <h2 className="font-display text-2xl text-foreground">{el?.timeline || t("event.timeline")}</h2>
              <CorpDivider color={accent} />
            </div>
            <ScheduleTimeline schedule={event.schedule} accentColor={accent} />
          </div>
        </section>
      )}

      {hasBlock("-agenda") && <AgendaSection agenda={blockCfg.agenda} accentColor={accent} lang={lang} />}
      {hasBlock("-menu") && <FoodMenuSection menu={blockCfg.menu} accentColor={accent} lang={lang} />}

      {/* Details */}
      <section className="py-28 relative overflow-hidden bg-card">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">{el?.details || t("event.details")}</h2>
            <CorpDivider color={accent} />
          </div>
          <div className={`grid gap-12 max-w-2xl mx-auto ${event.dress_code ? "md:grid-cols-2" : "md:grid-cols-1 max-w-lg"}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                <MapPin className="w-6 h-6" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{el?.location || t("event.location")}</h3>
              <p className="font-body text-sm text-muted-foreground">{event.location_name || "—"}</p>
              <p className="font-body text-sm text-muted-foreground">{event.address || ""}</p>
            </motion.div>
            {event.dress_code && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-center p-8 bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                  <Shirt className="w-6 h-6" style={{ color: accent }} />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{el?.dressCode || t("event.dressCode")}</h3>
                <p className="font-body text-sm text-muted-foreground">{event.dress_code}</p>
              </motion.div>
            )}
          </div>
          {event.address && (
            <div className="mt-12 max-w-xl mx-auto"><GoogleMapsEmbed address={event.address} /></div>
          )}
        </div>
      </section>

      {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
        <HotelRecommendations hotels={event.hotel_recommendations} accentColor={accent} />
      )}

      {hasBlock("-products") && <ProductsSection products={blockCfg.products} accentColor={accent} lang={lang} />}
      {hasBlock("-sponsors") && <SponsorsSection sponsors={blockCfg.sponsors} accentColor={accent} lang={lang} />}

      {event.rsvp_enabled && (
        <RsvpForm eventId={event.id} rsvpDeadline={event.rsvp_deadline} menuSelection={event.menu_selection || false} variant="corporate" lang={lang} />
      )}

      {/* Footer */}
      <footer className="py-20 text-center relative overflow-hidden bg-card">
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="relative">
          <h2 className="font-display text-2xl text-foreground mb-2">{event.title}</h2>
          <CorpDivider color={accent} />
          <p className="font-body text-sm text-muted-foreground mt-3">{formattedDate}</p>
        </div>
      </footer>
      </motion.div>
      )}
    </div>
  );
};

export default PremiumCorporatePage;
