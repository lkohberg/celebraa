import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/components/TemplateCard";
import { useNavigate } from "react-router-dom";
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
    menu_selection: true,
    hero_image_url: template.defaultHeroImage || null,
  };

  if (template.eventType === "wedding") {
    return {
      ...base,
      title: "Anna & Thomas",
      description: "Wir laden euch herzlich zu unserer Hochzeit ein!",
      location_name: "Schloss Mirabell",
      address: "Mirabellplatz 4, 5020 Salzburg",
      story_text: "Wir haben uns an einem Frühlingsnachmittag kennengelernt, zwischen Lachen und Kaffee. Seitdem ist jeder Tag ein neues Abenteuer zusammen.",
      ceremony_location: "Kirche St. Peter",
      ceremony_address: "St. Peter Bezirk 1, 5020 Salzburg",
      reception_location: "Schloss Mirabell",
      reception_address: "Mirabellplatz 4, 5020 Salzburg",
      dress_code: "Festlich / Semi-formal",
      children_welcome: true,
      hotel_recommendations: [
        { name: "Hotel Sacher Salzburg", address: "Schwarzstraße 5-7, 5020 Salzburg", url: "https://www.sacher.com" },
      ],
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
      story_text: "30 Jahre voller Abenteuer, Freundschaft und unvergesslicher Momente!",
      dress_code: "Schick & Bunt",
      schedule: [
        { time: "18:00", label: "Ankommen & Begrüßung" },
        { time: "19:00", label: "Buffet" },
        { time: "20:30", label: "Torte & Überraschung" },
        { time: "21:00", label: "Party!" },
      ],
    };
  }

  return {
    ...base,
    title: "Jahreskonferenz 2026",
    description: "Innovationen und Visionen für die Zukunft",
    location_name: "Austria Center Vienna",
    address: "Bruno-Kreisky-Platz 1, 1220 Wien",
    story_text: "Treffen Sie Branchenführer und entdecken Sie neue Trends.",
    dress_code: "Business Attire",
    schedule: [
      { time: "09:00", label: "Registrierung & Kaffee" },
      { time: "10:00", label: "Keynote" },
      { time: "12:00", label: "Mittagspause" },
      { time: "14:00", label: "Workshops" },
    ],
  };
};

const DemoPreview = ({ template, open, onOpenChange }: DemoPreviewProps) => {
  const navigate = useNavigate();

  if (!template) return null;

  const demoEvent = getDemoEvent(template);
  const theme = {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    font: template.font,
  };

  const renderPreview = () => {
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Demo: {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-xl overflow-hidden -mx-6 -mb-6">
          {renderPreview()}
        </div>

        <div className="flex justify-center mt-4">
          <Button
            className="font-body"
            onClick={() => {
              onOpenChange(false);
              navigate(`/order/${template.id}`);
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
