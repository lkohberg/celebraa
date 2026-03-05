import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useTranslation } from "@/i18n";

// Default hero images for templates
import heroBirthdayNeon from "@/assets/hero-birthday-neon.jpg";
import heroBirthdayGlamour from "@/assets/hero-birthday-glamour.jpg";
import heroBirthdayGarden from "@/assets/hero-birthday-garden.jpg";
import heroWeddingFloral from "@/assets/hero-wedding-floral.jpg";
import heroWeddingClassic from "@/assets/hero-wedding-classic.jpg";
import heroWeddingModern from "@/assets/hero-wedding-modern.jpg";
import heroCorporateExecutive from "@/assets/hero-corporate-executive.jpg";
import heroCorporateTech from "@/assets/hero-corporate-tech.jpg";
import heroCorporateGala from "@/assets/hero-corporate-gala.jpg";

export interface Template {
  id: string;
  name: string;
  description: string;
  eventType: "birthday" | "wedding" | "corporate";
  colors: { primary: string; secondary: string; accent: string };
  font: string;
  previewGradient: string;
  tier: "premium";
  premiumFeatures?: string[];
  defaultHeroImage?: string;
}

export const templates: Template[] = [
  // Birthday
  {
    id: "birthday-premium-neon",
    name: "Neon Party",
    description: "Lebhaft und bunt mit Konfetti-Animation",
    eventType: "birthday",
    colors: { primary: "#FF6B9D", secondary: "#FFF0F5", accent: "#4D96FF" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #FF6B9D 0%, #C44DFF 50%, #4D96FF 100%)",
    tier: "premium",
    premiumFeatures: ["Konfetti-Animation", "Countdown-Timer", "RSVP-Formular", "Programm-Sektion"],
    defaultHeroImage: heroBirthdayNeon,
  },
  {
    id: "birthday-premium-glamour",
    name: "Glamour Night",
    description: "Elegant und glamourös mit goldenen Akzenten",
    eventType: "birthday",
    colors: { primary: "#D4AF37", secondary: "#0D0D0D", accent: "#F5F5DC" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #1A1A2E 0%, #D4AF37 100%)",
    tier: "premium",
    premiumFeatures: ["Konfetti-Animation", "Countdown-Timer", "RSVP-Formular", "Party-Details"],
    defaultHeroImage: heroBirthdayGlamour,
  },
  {
    id: "birthday-premium-garden",
    name: "Garden Party",
    description: "Frisch und natürlich für Outdoor-Feiern",
    eventType: "birthday",
    colors: { primary: "#6BCB77", secondary: "#F0F7F4", accent: "#2D6A4F" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #F0F7F4 0%, #6BCB77 100%)",
    tier: "premium",
    premiumFeatures: ["Konfetti-Animation", "Countdown-Timer", "RSVP-Formular", "Location-Details"],
    defaultHeroImage: heroBirthdayGarden,
  },
  // Wedding
  {
    id: "wedding-premium-floral",
    name: "Floral Romance",
    description: "Romantisch mit Envelope-Animation und Countdown",
    eventType: "wedding",
    colors: { primary: "#5C7A5C", secondary: "#FFF8F0", accent: "#D4A0A0" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FFF0F0 0%, #E8D5C4 50%, #D5E8D4 100%)",
    tier: "premium",
    premiumFeatures: ["Envelope-Animation", "Countdown-Timer", "RSVP-Formular"],
    defaultHeroImage: heroWeddingFloral,
  },
  {
    id: "wedding-premium-classic",
    name: "Classic Elegance",
    description: "Zeitlos elegant mit allen Premium-Features",
    eventType: "wedding",
    colors: { primary: "#8B7355", secondary: "#FAF5EF", accent: "#1A1A1A" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FAF5EF 0%, #D4C5A9 100%)",
    tier: "premium",
    premiumFeatures: ["Envelope-Animation", "Countdown-Timer", "RSVP-Formular"],
    defaultHeroImage: heroWeddingClassic,
  },
  {
    id: "wedding-premium-modern",
    name: "Modern Love",
    description: "Modern und minimalistisch mit Premium-Features",
    eventType: "wedding",
    colors: { primary: "#2C2C2C", secondary: "#FAFAFA", accent: "#C9A96E" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)",
    tier: "premium",
    premiumFeatures: ["Envelope-Animation", "Countdown-Timer", "RSVP-Formular"],
    defaultHeroImage: heroWeddingModern,
  },
  // Corporate
  {
    id: "corporate-premium-executive",
    name: "Executive Summit",
    description: "Premium Business-Event mit Agenda und Speaker",
    eventType: "corporate",
    colors: { primary: "#1E3A5F", secondary: "#F8F9FA", accent: "#C8A951" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)",
    tier: "premium",
    premiumFeatures: ["Countdown-Timer", "Agenda-Sektion", "Anmelde-Formular"],
    defaultHeroImage: heroCorporateExecutive,
  },
  {
    id: "corporate-premium-tech",
    name: "Tech Conference",
    description: "Modern und technisch für IT-Events",
    eventType: "corporate",
    colors: { primary: "#6C63FF", secondary: "#0F0E17", accent: "#FF6584" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #0F0E17 0%, #6C63FF 100%)",
    tier: "premium",
    premiumFeatures: ["Countdown-Timer", "Agenda-Sektion", "Anmelde-Formular"],
    defaultHeroImage: heroCorporateTech,
  },
  {
    id: "corporate-premium-gala",
    name: "Gala Evening",
    description: "Luxuriös und exklusiv für Gala-Abende",
    eventType: "corporate",
    colors: { primary: "#C8A951", secondary: "#0D0D0D", accent: "#F5F5DC" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #0D0D0D 0%, #C8A951 100%)",
    tier: "premium",
    premiumFeatures: ["Countdown-Timer", "Agenda-Sektion", "Anmelde-Formular"],
    defaultHeroImage: heroCorporateGala,
  },
];

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onDemo: (template: Template) => void;
}

const TemplateCard = ({ template, onSelect, onDemo }: TemplateCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div
        className="h-48 relative overflow-hidden"
        style={{ background: template.previewGradient }}
      >
        {template.defaultHeroImage && (
          <img
            src={template.defaultHeroImage}
            alt={template.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <p
              className="text-2xl font-bold opacity-80"
              style={{
                fontFamily: template.font,
                color: template.defaultHeroImage ? "#FFFFFF" : template.colors.primary,
                textShadow: template.defaultHeroImage ? "0 2px 8px rgba(0,0,0,0.5)" : undefined,
              }}
            >
              {template.name}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {template.name}
          </h3>
          <Badge variant="outline" className="font-body text-[10px] px-1.5 py-0">
            ab €19
          </Badge>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-3">
          {template.description}
        </p>
        {template.premiumFeatures && (
          <div className="flex flex-wrap gap-1 mb-4">
            {template.premiumFeatures.slice(0, 3).map((f) => (
              <span key={f} className="text-[10px] font-body bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Button
            size="sm"
            className="flex-1 font-body"
            onClick={() => onSelect(template)}
          >
            {t("templates.select")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDemo(template)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
