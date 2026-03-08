import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/components/TemplateCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";
import PremiumWeddingPage from "@/components/premium-templates/PremiumWeddingPage";
import PremiumBirthdayPage from "@/components/premium-templates/PremiumBirthdayPage";
import PremiumCorporatePage from "@/components/premium-templates/PremiumCorporatePage";

interface DemoPreviewProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getDemoEvent = (template: Template, t: (key: string) => string) => {
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
      title: t("demo.wedding.title"),
      description: t("demo.wedding.description"),
      location_name: t("demo.wedding.location"),
      address: t("demo.wedding.address"),
      story_text: t("demo.wedding.story"),
      ceremony_location: t("demo.wedding.ceremonyLocation"),
      ceremony_address: t("demo.wedding.ceremonyAddress"),
      reception_location: t("demo.wedding.location"),
      reception_address: t("demo.wedding.address"),
      dress_code: t("demo.wedding.dressCode"),
      children_welcome: true,
      hotel_recommendations: [
        { name: t("demo.wedding.hotel1.name"), address: "Schwarzstraße 5-7, 5020 Salzburg", url: "https://www.sacher.com" },
        { name: t("demo.wedding.hotel2.name"), address: "Makartplatz 4, 5020 Salzburg", url: "https://www.bristol.at" },
      ],
      schedule: [
        { time: "15:00", label: t("demo.wedding.schedule.1") },
        { time: "16:30", label: t("demo.wedding.schedule.2") },
        { time: "18:00", label: t("demo.wedding.schedule.3") },
        { time: "20:00", label: t("demo.wedding.schedule.4") },
      ],
      selected_blocks: [
        "wedding-timeline", "wedding-story", "wedding-wishlist", "wedding-dresscode",
        "wedding-bgmusic", "wedding-hotels", "wedding-slideshow", "wedding-menu",
        "wedding-shuttle", "wedding-musicpro", "wedding-illustration",
      ],
      block_config: {
        menu: [
          { name: t("demo.wedding.menu.1.name"), description: t("demo.wedding.menu.1.desc") },
          { name: t("demo.wedding.menu.2.name"), description: t("demo.wedding.menu.2.desc") },
          { name: t("demo.wedding.menu.3.name"), description: t("demo.wedding.menu.3.desc") },
        ],
        dresscode_male: t("demo.wedding.dresscode.male"),
        dresscode_female: t("demo.wedding.dresscode.female"),
        shuttle: [
          { time: "14:30", from: t("demo.wedding.shuttle.from"), to: t("demo.wedding.ceremonyLocation"), note: t("demo.wedding.shuttle.1.note") },
          { time: "16:00", from: t("demo.wedding.ceremonyLocation"), to: t("demo.wedding.location") },
          { time: "00:00", from: t("demo.wedding.location"), to: t("demo.wedding.shuttle.from"), note: t("demo.wedding.shuttle.3.note") },
        ],
        wishlist: [
          { name: t("demo.wedding.wishlist.1.name"), hint: t("demo.wedding.wishlist.1.hint") },
          { name: t("demo.wedding.wishlist.2.name"), hint: t("demo.wedding.wishlist.2.hint"), url: "https://example.com" },
          { name: t("demo.wedding.wishlist.3.name"), hint: t("demo.wedding.wishlist.3.hint") },
        ],
      },
    };
  }

  if (template.eventType === "birthday") {
    return {
      ...base,
      title: t("demo.birthday.title"),
      description: t("demo.birthday.description"),
      location_name: t("demo.birthday.location"),
      address: t("demo.birthday.address"),
      story_text: t("demo.birthday.story"),
      dress_code: t("demo.birthday.dressCode"),
      schedule: [
        { time: "18:00", label: t("demo.birthday.schedule.1") },
        { time: "19:00", label: t("demo.birthday.schedule.2") },
        { time: "20:30", label: t("demo.birthday.schedule.3") },
        { time: "21:00", label: t("demo.birthday.schedule.4") },
      ],
      selected_blocks: [
        "party-timeline", "party-musicwish", "party-wishlist", "party-dresscode",
        "party-quiz", "party-menu", "party-games", "party-potluck",
      ],
      block_config: {
        menu: [
          { name: t("demo.birthday.menu.1.name"), description: t("demo.birthday.menu.1.desc") },
          { name: t("demo.birthday.menu.2.name"), description: t("demo.birthday.menu.2.desc") },
          { name: t("demo.birthday.menu.3.name"), description: t("demo.birthday.menu.3.desc") },
        ],
        dresscode_male: t("demo.birthday.dresscode.male"),
        dresscode_female: t("demo.birthday.dresscode.female"),
        quiz: [
          { question: t("demo.birthday.quiz.1.question"), options: ["Dancing Queen", "Bohemian Rhapsody", "Happy", "Shut Up and Dance"] },
          { question: t("demo.birthday.quiz.2.question"), options: ["Japan", "Island", "Mexiko", "Neuseeland"] },
        ],
        games: [
          { name: t("demo.birthday.games.1"), emoji: "🍺" },
          { name: t("demo.birthday.games.2"), emoji: "🎤" },
          { name: t("demo.birthday.games.3"), emoji: "🤔" },
          { name: t("demo.birthday.games.4"), emoji: "⚽" },
        ],
        potluck: [
          { item: t("demo.birthday.potluck.1"), assignedTo: "" },
          { item: t("demo.birthday.potluck.2"), assignedTo: "" },
          { item: t("demo.birthday.potluck.3"), assignedTo: "" },
        ],
        wishlist: [
          { name: t("demo.birthday.wishlist.1.name"), hint: t("demo.birthday.wishlist.1.hint") },
          { name: t("demo.birthday.wishlist.2.name"), hint: t("demo.birthday.wishlist.2.hint") },
          { name: t("demo.birthday.wishlist.3.name"), hint: t("demo.birthday.wishlist.3.hint") },
        ],
      },
    };
  }

  return {
    ...base,
    title: t("demo.corporate.title"),
    description: t("demo.corporate.description"),
    location_name: t("demo.corporate.location"),
    address: t("demo.corporate.address"),
    story_text: t("demo.corporate.story"),
    dress_code: t("demo.corporate.dressCode"),
    hotel_recommendations: [
      { name: t("demo.corporate.hotel1.name"), address: "Donau-City-Straße 7, 1220 Wien", url: "https://www.melia.com" },
      { name: t("demo.corporate.hotel2.name"), address: "Handelskai 269, 1020 Wien", url: "https://www.hilton.com" },
    ],
    schedule: [
      { time: "09:00", label: t("demo.corporate.schedule.1") },
      { time: "10:00", label: t("demo.corporate.schedule.2") },
      { time: "12:00", label: t("demo.corporate.schedule.3") },
      { time: "14:00", label: t("demo.corporate.schedule.4") },
    ],
    selected_blocks: [
      "business-timeline", "business-dresscode", "business-hotels",
      "business-menu", "business-agenda", "business-products", "business-sponsors",
    ],
    block_config: {
      menu: [
        { name: t("demo.corporate.menu.1.name"), description: t("demo.corporate.menu.1.desc") },
        { name: t("demo.corporate.menu.2.name"), description: t("demo.corporate.menu.2.desc") },
        { name: t("demo.corporate.menu.3.name"), description: t("demo.corporate.menu.3.desc") },
      ],
      agenda: [
        { time: "10:00", title: t("demo.corporate.agenda.1.title"), speaker: t("demo.corporate.agenda.1.speaker") },
        { time: "11:30", title: t("demo.corporate.agenda.2.title"), speaker: t("demo.corporate.agenda.2.speaker") },
        { time: "14:00", title: t("demo.corporate.agenda.3.title"), speaker: t("demo.corporate.agenda.3.speaker") },
        { time: "14:00", title: t("demo.corporate.agenda.4.title"), speaker: t("demo.corporate.agenda.4.speaker") },
      ],
      products: [
        { name: t("demo.corporate.products.1.name"), description: t("demo.corporate.products.1.desc"), imageUrl: "" },
        { name: t("demo.corporate.products.2.name"), description: t("demo.corporate.products.2.desc"), imageUrl: "" },
        { name: t("demo.corporate.products.3.name"), description: t("demo.corporate.products.3.desc"), imageUrl: "" },
      ],
      sponsors: [
        { name: "TechCorp" },
        { name: "InnovateLab" },
        { name: "FutureVision" },
        { name: "CloudBase" },
      ],
    },
  };
};

const DemoPreview = ({ template, open, onOpenChange }: DemoPreviewProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!template) return null;

  const demoEvent = getDemoEvent(template, t);
  const theme = {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    font: template.font,
  };

  const renderPreview = () => {
    switch (template.eventType) {
      case "wedding":
        return <PremiumWeddingPage event={demoEvent} theme={theme} isDemo />;
      case "birthday":
        return <PremiumBirthdayPage event={demoEvent} theme={theme} isDemo />;
      case "corporate":
        return <PremiumCorporatePage event={demoEvent} theme={theme} isDemo />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Demo: {template.name}</DialogTitle>

        <div className="rounded-xl overflow-hidden">
          {renderPreview()}
        </div>

        <div className="flex justify-center py-4">
          <Button
            className="font-body"
            onClick={() => {
              onOpenChange(false);
              navigate(`/order/${template.id}`);
            }}
          >
            {t("demo.chooseDesign")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoPreview;
