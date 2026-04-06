import { useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { useEventByLink, useTrackAnalytics } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RsvpForm from "@/components/premium-templates/RsvpForm";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

// Lazy-load heavy premium templates – only the needed one gets downloaded
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

// Reserved routes that cannot be used as event links
const RESERVED_ROUTES = ["templates", "configure", "success", "dashboard", "admin", "login", "signup", "settings", "api", "auth"];

const EventPage = () => {
  const { eventLink, lang: langParam } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // If the eventLink matches a reserved route, don't try to load it as an event
  const isReserved = RESERVED_ROUTES.includes(eventLink?.toLowerCase() || "");
  const { data: event, isLoading, error } = useEventByLink(isReserved ? "" : (eventLink || ""));
  
  // Determine event language from URL param, fallback to first language of event, then 'de'
  const eventLang: EventLang = (langParam as EventLang) || "de";
  const labels = getEventLabels(eventLang);
  const trackAnalytics = useTrackAnalytics();

  const fontName = event?.font || "Playfair Display";
  const heroImageUrl = (event as any)?.hero_image_url;

  // Preload hero image so it's ready before rendering
  const [heroReady, setHeroReady] = useState(!heroImageUrl);
  useEffect(() => {
    if (!heroImageUrl) { setHeroReady(true); return; }
    const img = new Image();
    img.src = heroImageUrl;
    if (img.complete) { setHeroReady(true); return; }
    img.onload = () => setHeroReady(true);
    img.onerror = () => setHeroReady(true);
    // Also inject a preload link for the browser
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImageUrl;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [heroImageUrl]);

  // Load Google Font for basis template
  useEffect(() => {
    const tier = (event as any)?.tier;
    if (event && (!tier || tier === "basis")) {
      loadGoogleFont(fontName);
    }
  }, [fontName, event]);

  // Track page view
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
    // Show a blank screen while loading – no visible loading indicator for guests
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

  // Cast event to include new columns (they exist in DB but not yet in generated types)
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

  // Build theme from event's primary_color
  const eventTheme = eventData.primary_color ? {
    primary: eventData.primary_color,
    secondary: "hsl(30, 33%, 96%)",
    accent: "hsl(30, 10%, 25%)",
    font: eventData.font || "Playfair Display",
  } : undefined;

  const blankFallback = <div className="min-h-screen" style={{ backgroundColor: eventTheme?.primary ? undefined : undefined }} />;

  // Premium templates – lazy loaded, only the needed chunk is downloaded
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

  // Basis template - polished minimal page
  const primaryColor = event.primary_color || "#C8A951";

  const dateLocaleMap: Record<string, string> = { de: "de-AT", en: "en-US", es: "es-ES", pt: "pt-BR", fr: "fr-FR", it: "it-IT", pl: "pl-PL", ro: "ro-RO", nl: "nl-NL", tr: "tr-TR", zh: "zh-CN" };
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocaleMap[eventLang] || "de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ fontFamily: `'${fontName}', serif`, backgroundColor: "#FAFAF8" }}>
      {/* Accent top bar */}
      <div className="w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }} />

      <div className="max-w-xl mx-auto px-6 py-20 md:py-28">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: primaryColor, opacity: 0.7 }}>
            {labels.rsvp}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-[1.1]"
            style={{ color: "#1A1A1A" }}
          >
            {event.title}
          </h1>
          <div className="w-12 h-px mx-auto my-6" style={{ backgroundColor: primaryColor }} />
          {event.description && (
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(26,26,26,0.55)" }}>{event.description}</p>
          )}
        </div>

        {/* Event details card */}
        <div className="p-8 mb-16 text-center" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
              <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
              <Clock className="w-4 h-4" style={{ color: primaryColor }} />
              <span>{event.event_time}</span>
            </div>
            {event.location_name && (
              <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{event.location_name}{event.address ? `, ${event.address}` : ""}</span>
              </div>
            )}
          </div>
        </div>

        {event.rsvp_enabled && (
          <RsvpForm
            eventId={event.id}
            rsvpDeadline={event.rsvp_deadline}
            menuSelection={event.menu_selection || false}
            variant="wedding"
            lang={eventLang}
          />
        )}
      </div>

      {/* Footer accent */}
      <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)` }} />
    </div>
  );
};

export default EventPage;
