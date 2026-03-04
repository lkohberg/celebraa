import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, ChevronDown, Shirt, Baby } from "lucide-react";
import { useTranslation } from "@/i18n";
import EnvelopeIntro from "./EnvelopeIntro";
import CountdownTimer from "./CountdownTimer";
import RsvpForm from "./RsvpForm";
import ScheduleTimeline from "./ScheduleTimeline";
import GoogleMapsEmbed from "./GoogleMapsEmbed";
import HotelRecommendations from "./HotelRecommendations";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";

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
}

export interface PremiumTheme {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
}

const PremiumWeddingPage = ({ event, theme, lang }: { event: PremiumEventData; theme?: PremiumTheme; lang?: EventLang }) => {
  const { t } = useTranslation();
  const el = lang ? getEventLabels(lang) : null;
  const [showContent, setShowContent] = useState(false);

  const names = event.title;
  const formattedDate = new Date(event.event_date).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ fontFamily: theme?.font ? `'${theme.font}', sans-serif` : "'Lato', 'DM Sans', sans-serif", backgroundColor: theme?.secondary || "hsl(30, 33%, 96%)", color: theme?.accent || "hsl(30, 10%, 25%)" }}>
      <link href={`https://fonts.googleapis.com/css2?family=Great+Vibes&family=${encodeURIComponent(theme?.font || 'Playfair Display')}:wght@300;400;500;600;700&family=Lato:wght@300;400;500&display=swap`} rel="stylesheet" />

      {!showContent && <EnvelopeIntro names={names} onOpen={() => setShowContent(true)} tapLabel={el?.tapToOpen} />}

      {showContent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {event.hero_image_url ? (
              <>
                <div className="absolute inset-0">
                  <img src={event.hero_image_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/30" />
              </>
            ) : (
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(340 30% 90%) 0%, hsl(30 35% 93%) 50%, hsl(150 15% 88%) 100%)" }} />
            )}

            <motion.div
              className="relative z-10 text-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <p className="font-body text-sm tracking-[0.3em] uppercase mb-4" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.8)" : "hsl(30, 8%, 50%)" }}>
                {el?.weMarry || t("event.weMarry")}
              </p>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl mb-6"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: event.hero_image_url ? "white" : "hsl(30, 10%, 25%)",
                  lineHeight: 1.2,
                }}
              >
                {names}
              </h1>
              <div className="w-24 h-px mx-auto mb-6" style={{ backgroundColor: event.hero_image_url ? "rgba(255,255,255,0.5)" : "hsl(30, 20%, 80%)" }} />
              <p
                className="text-xl md:text-2xl italic"
                style={{
                  fontFamily: "var(--font-display)",
                  color: event.hero_image_url ? "rgba(255,255,255,0.9)" : "hsl(30, 10%, 35%)",
                }}
              >
                {formattedDate}
              </p>
              {event.description && (
                <p className="font-body text-sm mt-2 tracking-[0.15em] uppercase" style={{ color: event.hero_image_url ? "rgba(255,255,255,0.7)" : "hsl(30, 8%, 50%)" }}>
                  {event.description}
                </p>
              )}
            </motion.div>

            <button
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}
              style={{ color: event.hero_image_url ? "rgba(255,255,255,0.6)" : "hsl(30, 8%, 50%)" }}
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </button>
          </section>

          {/* Countdown */}
          <section id="countdown" className="py-20" style={{ backgroundColor: "hsl(30, 30%, 98%)" }}>
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                {el?.countdown || t("event.countdown")}
              </p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12">
                {el?.countdownSub || t("event.countdownSub")}
              </h2>
              <CountdownTimer targetDate={event.event_date} targetTime={event.event_time} lang={lang} />
            </div>
          </section>

          {/* Story */}
          {event.story_text && (
            <section className="py-24" style={{ backgroundColor: "hsl(30, 33%, 96%)" }}>
              <div className="max-w-2xl mx-auto px-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-4" style={{ color: "hsl(10, 50%, 82%)" }} />
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  {el?.ourStory || t("event.ourStory")}
                </h2>
                <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: "hsl(10, 50%, 82%)" }} />
                <p className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.story_text}
                </p>
              </div>
            </section>
          )}

          {/* Schedule Timeline */}
          {event.schedule && Array.isArray(event.schedule) && event.schedule.length > 0 && (
            <section className="py-20" style={{ backgroundColor: "hsl(30, 33%, 96%)" }}>
              <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-12">
                  <Clock className="w-6 h-6 mx-auto mb-3" style={{ color: "hsl(150, 18%, 38%)" }} />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">{t("event.timeline")}</h2>
                </div>
                <ScheduleTimeline schedule={event.schedule} accentColor="hsl(150, 18%, 38%)" />
              </div>
            </section>
          )}

          {/* Details */}
          <section className="py-24" style={{ backgroundColor: "hsl(30, 30%, 98%)" }}>
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  {el?.details || t("event.details")}
                </h2>
                <div className="w-16 h-px mx-auto" style={{ backgroundColor: "hsl(10, 50%, 82%)" }} />
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                {/* Ceremony */}
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(150, 18%, 38%)" }} />
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.ceremony || t("event.ceremony")}</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {event.ceremony_location || event.location_name || "—"}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {event.ceremony_address || event.address || ""}
                  </p>
                </div>

                {/* Dress Code */}
                {event.dress_code && (
                  <div className="text-center">
                    <Shirt className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(150, 18%, 38%)" }} />
                    <h3 className="font-display text-xl text-foreground mb-3">{t("event.dressCode")}</h3>
                    <p className="font-body text-sm text-muted-foreground">
                      {event.dress_code}
                    </p>
                  </div>
                )}

                {/* Reception */}
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(150, 18%, 38%)" }} />
                  <h3 className="font-display text-xl text-foreground mb-3">{el?.reception || t("event.reception")}</h3>
                  <p className="font-body text-sm text-muted-foreground">
                    {event.reception_location || event.location_name || "—"}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {event.reception_address || event.address || ""}
                  </p>
                </div>
              </div>

              {/* Children info */}
              {event.children_welcome !== null && event.children_welcome !== undefined && (
                <div className="text-center mt-10">
                  <p className="font-body text-sm text-muted-foreground italic">
                    {event.children_welcome ? t("event.childrenWelcome") : t("event.adultsOnly")}
                  </p>
                </div>
              )}

              {/* Google Maps */}
              {(event.address || event.ceremony_address) && (
                <div className="mt-12 max-w-xl mx-auto">
                  <GoogleMapsEmbed address={event.ceremony_address || event.address || ""} />
                </div>
              )}
            </div>
          </section>

          {/* Hotel Recommendations */}
          {event.hotel_recommendations && Array.isArray(event.hotel_recommendations) && event.hotel_recommendations.length > 0 && (
            <HotelRecommendations hotels={event.hotel_recommendations} accentColor="hsl(150, 18%, 38%)" />
          )}

          {/* RSVP */}
          {event.rsvp_enabled && (
            <RsvpForm
              eventId={event.id}
              rsvpDeadline={event.rsvp_deadline}
              menuSelection={event.menu_selection || false}
              variant="wedding"
              lang={lang}
            />
          )}

          {/* Footer */}
          <footer className="py-16 text-center" style={{ backgroundColor: "hsl(30, 30%, 98%)" }}>
            <h2
              className="text-3xl mb-4"
              style={{ fontFamily: "'Great Vibes', cursive", color: "hsl(150, 18%, 38%)" }}
            >
              {names}
            </h2>
            <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase">
              {formattedDate.replace(/\s/g, " · ")}
            </p>
            <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: "hsl(10, 50%, 82%)" }} />
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default PremiumWeddingPage;
