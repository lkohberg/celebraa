import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useEventByLink, useTrackAnalytics } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PremiumWeddingPage from "@/components/premium-templates/PremiumWeddingPage";
import PremiumBirthdayPage from "@/components/premium-templates/PremiumBirthdayPage";
import PremiumCorporatePage from "@/components/premium-templates/PremiumCorporatePage";
import RsvpForm from "@/components/premium-templates/RsvpForm";
import { Calendar, Clock, MapPin } from "lucide-react";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

const EventPage = () => {
  const { eventLink, lang: langParam } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: event, isLoading, error } = useEventByLink(eventLink || "");
  
  // Determine event language from URL param, fallback to first language of event, then 'de'
  const eventLang: EventLang = (langParam as EventLang) || "de";
  const labels = getEventLabels(eventLang);
  const trackAnalytics = useTrackAnalytics();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-muted-foreground">{t("event.loading")}</p>
      </div>
    );
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

  // Premium templates
  if (eventData.tier === "premium") {
    const templateId = eventData.template_id;
    if (templateId.startsWith("wedding-premium") || templateId.startsWith("wedding-")) {
      if (templateId.includes("premium")) {
        return <PremiumWeddingPage event={eventData} lang={eventLang} />;
      }
    }
    if (templateId.startsWith("birthday-premium") || templateId.startsWith("birthday-")) {
      if (templateId.includes("premium")) {
        return <PremiumBirthdayPage event={eventData} lang={eventLang} />;
      }
    }
    if (templateId.startsWith("corporate-premium") || templateId.startsWith("corporate-")) {
      if (templateId.includes("premium")) {
        return <PremiumCorporatePage event={eventData} lang={eventLang} />;
      }
    }
    // Fallback: detect by template prefix for premium tier
    if (templateId.startsWith("wedding")) return <PremiumWeddingPage event={eventData} lang={eventLang} />;
    if (templateId.startsWith("birthday")) return <PremiumBirthdayPage event={eventData} lang={eventLang} />;
    if (templateId.startsWith("corporate")) return <PremiumCorporatePage event={eventData} lang={eventLang} />;
  }

  // Basis template - simple styled page
  const dateLocaleMap: Record<string, string> = { de: "de-AT", en: "en-US", es: "es-ES", pt: "pt-BR", fr: "fr-FR", it: "it-IT", pl: "pl-PL", ro: "ro-RO", nl: "nl-NL", tr: "tr-TR", zh: "zh-CN" };
  const formattedDate = new Date(event.event_date).toLocaleDateString(dateLocaleMap[eventLang] || "de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {labels.rsvp}
          </p>
          <h1
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ color: event.primary_color || undefined }}
          >
            {event.title}
          </h1>
          {event.description && (
            <p className="font-body text-muted-foreground mt-2">{event.description}</p>
          )}
        </div>

        <div className="space-y-3 max-w-sm mx-auto mb-12">
          <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{event.event_time}</span>
          </div>
          {event.location_name && (
            <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{event.location_name}{event.address ? `, ${event.address}` : ""}</span>
            </div>
          )}
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
    </div>
  );
};

export default EventPage;
