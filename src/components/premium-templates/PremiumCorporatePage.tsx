import { motion } from "framer-motion";
import { Building2, MapPin, Clock, Calendar } from "lucide-react";
import { useTranslation } from "@/i18n";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";

interface EventData {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  description?: string | null;
  location_name?: string | null;
  address?: string | null;
  story_text?: string | null;
  schedule?: any;
  hero_image_url?: string | null;
  rsvp_enabled?: boolean | null;
  rsvp_deadline?: string | null;
  menu_selection?: boolean | null;
}

const PremiumCorporatePage = ({ event }: { event: EventData }) => {
  const { t } = useTranslation();

  const formattedDate = new Date(event.event_date).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center"
        style={{
          background: event.hero_image_url
            ? undefined
            : "linear-gradient(135deg, hsl(220 40% 15%) 0%, hsl(220 50% 25%) 100%)",
        }}
      >
        {event.hero_image_url && (
          <>
            <div className="absolute inset-0">
              <img src={event.hero_image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}

        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Building2 className="w-12 h-12 mx-auto mb-6 text-white/60" />
          <p className="font-body text-sm tracking-[0.3em] uppercase mb-4 text-white/60">
            {t("event.youreInvited")}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            {event.title}
          </h1>
          <div className="w-24 h-px mx-auto mb-6 bg-white/30" />
          <div className="flex items-center justify-center gap-6 text-white/70 font-body text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {event.event_time} Uhr
            </span>
          </div>
          {event.description && (
            <p className="font-body text-white/60 mt-6 text-lg max-w-xl mx-auto">
              {event.description}
            </p>
          )}
        </motion.div>
      </section>

      {/* Countdown */}
      <section className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-foreground mb-12">{t("event.countdown")}</h2>
          <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} />
        </div>
      </section>

      {/* About */}
      {event.story_text && (
        <section className="py-24 bg-background">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">
              {t("event.agenda")}
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {event.story_text}
            </p>
          </div>
        </section>
      )}

      {/* Details */}
      <section className="py-24 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground">{t("event.details")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(220, 50%, 35%)" }} />
              <h3 className="font-display text-xl text-foreground mb-3">{t("event.location")}</h3>
              <p className="font-body text-sm text-muted-foreground">{event.location_name || "—"}</p>
              <p className="font-body text-sm text-muted-foreground">{event.address || ""}</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(220, 50%, 35%)" }} />
              <h3 className="font-display text-xl text-foreground mb-3">{t("event.schedule")}</h3>
              {event.schedule && Array.isArray(event.schedule) ? (
                event.schedule.map((item: { time: string; label: string }, i: number) => (
                  <p key={i} className="font-body text-sm text-muted-foreground">
                    {item.label}: {item.time}
                  </p>
                ))
              ) : (
                <p className="font-body text-sm text-muted-foreground">{event.event_time} Uhr</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      {event.rsvp_enabled && (
        <RsvpForm
          eventId={event.id}
          rsvpDeadline={event.rsvp_deadline}
          menuSelection={event.menu_selection || false}
          variant="corporate"
        />
      )}

      {/* Footer */}
      <footer className="py-16 text-center bg-card">
        <h2 className="font-display text-2xl text-foreground mb-2">{event.title}</h2>
        <p className="font-body text-sm text-muted-foreground">{formattedDate}</p>
      </footer>
    </div>
  );
};

export default PremiumCorporatePage;
