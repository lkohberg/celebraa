import { useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useEventByLink, useTrackAnalytics } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RsvpForm from "@/components/premium-templates/RsvpForm";
import CountdownTimer from "@/components/premium-templates/CountdownTimer";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { motion } from "framer-motion";
import { colorWithAlpha } from "@/lib/color-utils";

const PremiumWeddingPage = lazy(() => import("@/components/premium-templates/PremiumWeddingPage"));
const PremiumBirthdayPage = lazy(() => import("@/components/premium-templates/PremiumBirthdayPage"));
const PremiumCorporatePage = lazy(() => import("@/components/premium-templates/PremiumCorporatePage"));

const loadGoogleFont = (fontName: string) => {
  const id = `google-font-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
};

const RESERVED_ROUTES = ["templates", "configure", "success", "dashboard", "admin", "login", "signup", "settings", "api", "auth"];

const EventPage = () => {
  const { eventLink, lang: langParam } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isReserved = RESERVED_ROUTES.includes(eventLink?.toLowerCase() || "");
  const { data: event, isLoading, error } = useEventByLink(isReserved ? "" : (eventLink || ""));

  const eventLang: EventLang = (langParam as EventLang) || "de";
  const labels = getEventLabels(eventLang);
  const trackAnalytics = useTrackAnalytics();

  const fontName = event?.font || "Playfair Display";
  const heroImageUrl = (event as any)?.hero_image_url;

  const [heroReady, setHeroReady] = useState(!heroImageUrl);
  useEffect(() => {
    if (!heroImageUrl) { setHeroReady(true); return; }
    const img = new Image();
    img.src = heroImageUrl;
    if (img.complete) { setHeroReady(true); return; }
    img.onload = () => setHeroReady(true);
    img.onerror = () => setHeroReady(true);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImageUrl;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [heroImageUrl]);

  useEffect(() => {
    const tier = (event as any)?.tier;
    if (event && (!tier || tier === "basis")) {
      loadGoogleFont(fontName);
    }
  }, [fontName, event]);

  useEffect(() => {
    if (event?.id) {
      trackAnalytics.mutate({
        event_id: event.id,
        event_type: "page_view",
        referrer: document.referrer || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  if (isLoading || !heroReady) {
    return <div className="min-h-screen bg-background" />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-body text-muted-foreground mb-4">{t("event.notFound")}</p>
          <Button onClick={() => navigate("/")}>{t("event.backHome")}</Button>
        </div>
      </div>
    );
  }

  const eventData = event as typeof event & {
    tier?: string;
    story_text?: string;
    ceremony_location?: string;
    ceremony_address?: string;
    reception_location?: string;
    reception_address?: string;
    schedule?: any;
    hero_image_url?: string;
  };

  const eventTheme = eventData.primary_color ? {
    primary: eventData.primary_color,
    secondary: "hsl(30, 33%, 96%)",
    accent: "hsl(30, 10%, 25%)",
    font: eventData.font || "Playfair Display",
  } : undefined;

  const blankFallback = <div className="min-h-screen" />;

  if (eventData.tier === "premium") {
    const templateId = eventData.template_id;
    let PremiumComponent: React.LazyExoticComponent<React.ComponentType<any>> | null = null;

    if (templateId.includes("wedding") || templateId.startsWith("wedding")) {
      PremiumComponent = PremiumWeddingPage;
    } else if (templateId.includes("birthday") || templateId.startsWith("birthday")) {
      PremiumComponent = PremiumBirthdayPage;
    } else if (templateId.includes("corporate") || templateId.startsWith("corporate")) {
      PremiumComponent = PremiumCorporatePage;
    }

    if (PremiumComponent) {
      const blockCfg = (eventData as any).block_config || {};
      const showIntro = !blockCfg.disable_intro;
      return (
        <Suspense fallback={blankFallback}>
          <PremiumComponent event={eventData} theme={eventTheme} lang={eventLang} showIntro={showIntro} />
        </Suspense>
      );
    }
  }

  // ── Basis template — upgraded ──
  const primaryColor = event.primary_color || "#C8A951";

  const dateLocaleMap: Record<string, string> = { de: "de-AT", en: "en-US", es: "es-ES", pt: "pt-BR", fr: "fr-FR", it: "it-IT", pl: "pl-PL", ro: "ro-RO", nl: "nl-NL", tr: "tr-TR", zh: "zh-CN" };
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocaleMap[eventLang] || "de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ fontFamily: `'${fontName}', serif`, backgroundColor: "hsl(30, 30%, 97%)" }}>
      {/* Hero with gradient */}
      <motion.section
        className="relative overflow-hidden py-24 md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `linear-gradient(160deg, ${colorWithAlpha(primaryColor, 0.12)} 0%, hsl(30, 30%, 97%) 60%)`,
        }}
      >
        {/* Decorative blob */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${primaryColor}, transparent 70%)` }}
        />
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
              {labels.rsvp}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              {event.title}
            </h1>
            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="w-10 h-px" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
              <div className="w-10 h-px" style={{ backgroundColor: primaryColor, opacity: 0.3 }} />
            </div>
            {event.description && (
              <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">{event.description}</p>
            )}
          </motion.div>

          {/* Detail pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 font-body text-sm text-muted-foreground shadow-sm">
              <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 font-body text-sm text-muted-foreground shadow-sm">
              <Clock className="w-4 h-4" style={{ color: primaryColor }} />
              {event.event_time}
            </span>
            {event.location_name && (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 font-body text-sm text-muted-foreground shadow-sm">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                {event.location_name}{event.address ? `, ${event.address}` : ""}
              </span>
            )}
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={eventLang} accentColor={primaryColor} />
          </motion.div>
        </div>
      </motion.section>

      {/* RSVP */}
      {event.rsvp_enabled && (
        <RsvpForm
          eventId={event.id}
          rsvpDeadline={event.rsvp_deadline}
          menuSelection={event.menu_selection || false}
          variant="wedding"
          lang={eventLang}
          accentColor={primaryColor}
        />
      )}

      {/* Footer */}
      <footer className="py-12 text-center" style={{ backgroundColor: "hsl(30, 30%, 97%)" }}>
        <p className="font-display text-lg" style={{ color: primaryColor }}>{event.title}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-8 h-px" style={{ backgroundColor: primaryColor, opacity: 0.25 }} />
          <p className="font-body text-xs text-muted-foreground tracking-[0.1em] uppercase">{formattedDate}</p>
          <div className="w-8 h-px" style={{ backgroundColor: primaryColor, opacity: 0.25 }} />
        </div>
      </footer>
    </div>
  );
};

export default EventPage;
