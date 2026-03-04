import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/components/TemplateCard";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import PremiumWeddingPage from "@/components/premium-templates/PremiumWeddingPage";
import PremiumBirthdayPage from "@/components/premium-templates/PremiumBirthdayPage";
import PremiumCorporatePage from "@/components/premium-templates/PremiumCorporatePage";

interface DemoPreviewProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getDemoEvent = (template: Template) => {
  const base = {
    id: "demo-preview",
    event_date: "2026-06-20",
    event_time: "18:00",
    rsvp_enabled: true,
    rsvp_deadline: "2026-05-01",
    menu_selection: false,
    hero_image_url: null,
  };

  if (template.eventType === "wedding") {
    return {
      ...base,
      title: "Anna & Thomas",
      description: "Wir laden euch herzlich zu unserer Hochzeit ein!",
      location_name: "Schloss Mirabell",
      address: "Mirabellplatz 4, 5020 Salzburg",
      story_text: "Wir haben uns an einem Frühlingsnachmittag kennengelernt, zwischen Lachen und Kaffee. Seitdem ist jeder Tag ein neues Abenteuer zusammen. Nach Jahren voller Liebe, gemeinsamer Träume und unvergesslicher Momente sind wir bereit für den nächsten Schritt.",
      ceremony_location: "Kirche St. Peter",
      ceremony_address: "St. Peter Bezirk 1, 5020 Salzburg",
      reception_location: "Schloss Mirabell",
      reception_address: "Mirabellplatz 4, 5020 Salzburg",
      schedule: [
        { time: "15:00", label: "Trauung" },
        { time: "16:30", label: "Empfang & Sektempfang" },
        { time: "18:00", label: "Abendessen" },
        { time: "20:00", label: "Party & Tanz" },
      ],
    };
  }

  if (template.eventType === "birthday") {
    return {
      ...base,
      title: "Sarahs 30. Geburtstag",
      description: "Feiert mit mir meinen 30. Geburtstag!",
      location_name: "Rooftop Bar Vienna",
      address: "Herrengasse 10, 1010 Wien",
      story_text: "30 Jahre voller Abenteuer, Freundschaft und unvergesslicher Momente. Lasst uns gemeinsam auf die nächsten 30 anstoßen!",
      schedule: [
        { time: "18:00", label: "Ankommen & Begrüßung" },
        { time: "19:00", label: "Buffet" },
        { time: "20:30", label: "Torte & Überraschung" },
        { time: "21:00", label: "Party!" },
      ],
    };
  }

  // corporate
  return {
    ...base,
    title: "Jahreskonferenz 2026",
    description: "Innovationen und Visionen für die Zukunft",
    location_name: "Austria Center Vienna",
    address: "Bruno-Kreisky-Platz 1, 1220 Wien",
    story_text: "Treffen Sie Branchenführer, entdecken Sie neue Trends und vernetzen Sie sich mit Gleichgesinnten auf unserer exklusiven Jahreskonferenz.",
    schedule: [
      { time: "09:00", label: "Registrierung & Kaffee" },
      { time: "10:00", label: "Keynote" },
      { time: "12:00", label: "Mittagspause & Networking" },
      { time: "14:00", label: "Workshops" },
      { time: "17:00", label: "Abschluss & Empfang" },
    ],
  };
};

const DemoPreview = ({ template, open, onOpenChange }: DemoPreviewProps) => {
  const navigate = useNavigate();

  if (!template) return null;

  const isPremium = template.tier === "premium";
  const demoEvent = isPremium ? getDemoEvent(template) : null;

  const eventTypeLabels = {
    birthday: "Geburtstag",
    wedding: "Hochzeit",
    corporate: "Firmen Event",
  };

  const theme = {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    font: template.font,
  };

  const renderPremiumPreview = () => {
    if (!demoEvent) return null;
    switch (template.eventType) {
      case "wedding":
        return <PremiumWeddingPage event={demoEvent} theme={theme} />;
      case "birthday":
        return <PremiumBirthdayPage event={demoEvent} theme={theme} />;
      case "corporate":
        return <PremiumCorporatePage event={demoEvent} theme={theme} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isPremium ? "max-w-5xl" : "max-w-2xl"} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Demo: {template.name}
          </DialogTitle>
        </DialogHeader>

        {isPremium ? (
          <div className="rounded-xl overflow-hidden -mx-6 -mb-6">
            {renderPremiumPreview()}
          </div>
        ) : (
          <>
            {/* Basis Preview Card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: template.previewGradient }}
            >
              <div className="p-8 md:p-12 text-center">
                <p className="text-sm font-body uppercase tracking-widest mb-4 opacity-60"
                  style={{ color: template.colors.accent }}>
                  {eventTypeLabels[template.eventType]}
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    fontFamily: template.font,
                    color: template.colors.primary === "#FFFFFF" || template.colors.secondary === "#FFFFFF"
                      ? template.colors.accent
                      : template.colors.primary,
                  }}
                >
                  {template.eventType === "wedding"
                    ? "Anna & Thomas"
                    : template.eventType === "birthday"
                    ? "Sarahs 30. Geburtstag"
                    : "Jahreskonferenz 2026"}
                </h2>
                <p className="font-body opacity-70 mt-2 mb-8"
                  style={{ color: template.colors.accent }}>
                  Wir laden euch herzlich ein!
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
                  <div className="flex items-center gap-2 opacity-70"
                    style={{ color: template.colors.accent }}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-body">15. Juni 2026</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-70"
                    style={{ color: template.colors.accent }}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-body">18:00 Uhr</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-70"
                    style={{ color: template.colors.accent }}>
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-body">Schloss Mirabell</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-70"
                    style={{ color: template.colors.accent }}>
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-body">80 Gäste</span>
                  </div>
                </div>

                {/* Fake RSVP */}
                <div className="mt-10 bg-background/80 backdrop-blur rounded-lg p-6 max-w-sm mx-auto">
                  <p className="font-display text-lg font-semibold text-foreground mb-3">
                    Bist du dabei?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button size="sm" className="font-body">
                      Ja, ich komme!
                    </Button>
                    <Button size="sm" variant="outline" className="font-body">
                      Leider nicht
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center font-body mt-2">
              Dies ist eine Demo-Vorschau – es werden keine echten Daten gespeichert.
            </p>
          </>
        )}

        <div className="flex justify-center mt-4">
          <Button
            className="font-body"
            onClick={() => {
              onOpenChange(false);
              navigate(`/configure/${template.id}`);
            }}
          >
            Dieses Design wählen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoPreview;
