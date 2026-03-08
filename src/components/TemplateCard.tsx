import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles, Star } from "lucide-react";
import { useTranslation } from "@/i18n";

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
  tagline: string;
  eventType: "birthday" | "wedding" | "corporate";
  colors: { primary: string; secondary: string; accent: string };
  font: string;
  previewGradient: string;
  tier: "premium";
  premiumFeatureKeys?: string[];
  premiumFeatures?: string[];
  defaultHeroImage?: string;
}

export const templates: Template[] = [
  // Birthday
  {
    id: "birthday-premium-neon",
    name: "Neon Party",
    tagline: "Let's glow! 🌟",
    description: "Lebhaft und farbenfroh — mit Konfettiregen, pulsierenden Neonfarben und einer Energie, die man sofort spürt. Perfekt für unvergessliche Partynächte.",
    eventType: "birthday",
    colors: { primary: "#FF6B9D", secondary: "#FFF0F5", accent: "#4D96FF" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #FF6B9D 0%, #C44DFF 50%, #4D96FF 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.confettiAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm", "templateCard.programSection"],
    defaultHeroImage: heroBirthdayNeon,
  },
  {
    id: "birthday-premium-glamour",
    name: "Glamour Night",
    tagline: "Shine bright ✨",
    description: "Opulent und glamourös — goldene Akzente auf dunklem Samt, für Geburtstagsfeiern mit dem gewissen Wow Faktor. Eleganz trifft auf Party.",
    eventType: "birthday",
    colors: { primary: "#D4AF37", secondary: "#0D0D0D", accent: "#F5F5DC" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #1A1A2E 0%, #D4AF37 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.confettiAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm", "templateCard.partyDetails"],
    defaultHeroImage: heroBirthdayGlamour,
  },
  {
    id: "birthday-premium-garden",
    name: "Garden Party",
    tagline: "Nature vibes 🌿",
    description: "Frisch und natürlich — sanfte Grüntöne und organische Formen für entspannte Feiern im Grünen. Leichtigkeit pur.",
    eventType: "birthday",
    colors: { primary: "#6BCB77", secondary: "#F0F7F4", accent: "#2D6A4F" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #F0F7F4 0%, #6BCB77 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.confettiAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm", "templateCard.locationDetails"],
    defaultHeroImage: heroBirthdayGarden,
  },
  // Wedding
  {
    id: "wedding-premium-floral",
    name: "Floral Romance",
    tagline: "Zeitlose Romantik 🌸",
    description: "Romantisch und verträumt — zarte Blütenfarben, eine elegante Briefumschlag Animation und jedes Detail liebevoll gestaltet. Für Hochzeiten wie aus dem Märchen.",
    eventType: "wedding",
    colors: { primary: "#5C7A5C", secondary: "#FFF8F0", accent: "#D4A0A0" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FFF0F0 0%, #E8D5C4 50%, #D5E8D4 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.envelopeAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm"],
    defaultHeroImage: heroWeddingFloral,
  },
  {
    id: "wedding-premium-classic",
    name: "Classic Elegance",
    tagline: "Ewige Schönheit 💍",
    description: "Zeitlos und raffiniert — warme Crème und Goldtöne, klassische Typografie und eine Eleganz, die nie aus der Mode kommt.",
    eventType: "wedding",
    colors: { primary: "#8B7355", secondary: "#FAF5EF", accent: "#1A1A1A" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FAF5EF 0%, #D4C5A9 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.envelopeAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm"],
    defaultHeroImage: heroWeddingClassic,
  },
  {
    id: "wedding-premium-modern",
    name: "Modern Love",
    tagline: "Puristisch schön 🤍",
    description: "Minimalistisch und modern — klare Linien, reduzierte Farbpalette und goldene Akzente. Für Paare, die Understatement lieben.",
    eventType: "wedding",
    colors: { primary: "#2C2C2C", secondary: "#FAFAFA", accent: "#C9A96E" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.envelopeAnimation", "templateCard.countdownTimer", "templateCard.rsvpForm"],
    defaultHeroImage: heroWeddingModern,
  },
  // Corporate
  {
    id: "corporate-premium-executive",
    name: "Executive Summit",
    tagline: "Business Excellence 📊",
    description: "Professionell und repräsentativ — Navy Blau trifft auf goldene Akzente. Ideal für Konferenzen, Summits und hochkarätige Events.",
    eventType: "corporate",
    colors: { primary: "#1E3A5F", secondary: "#F8F9FA", accent: "#C8A951" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.countdownTimer", "templateCard.agendaSection", "templateCard.registrationForm"],
    defaultHeroImage: heroCorporateExecutive,
  },
  {
    id: "corporate-premium-tech",
    name: "Tech Conference",
    tagline: "Innovation trifft Design 💡",
    description: "Futuristisch und dynamisch — dunkle Basis mit leuchtenden Akzentfarben. Für Tech Events, Hackathons und digitale Konferenzen.",
    eventType: "corporate",
    colors: { primary: "#6C63FF", secondary: "#0F0E17", accent: "#FF6584" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #0F0E17 0%, #6C63FF 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.countdownTimer", "templateCard.agendaSection", "templateCard.registrationForm"],
    defaultHeroImage: heroCorporateTech,
  },
  {
    id: "corporate-premium-gala",
    name: "Gala Evening",
    tagline: "Black Tie Glamour 🥂",
    description: "Luxuriös und exklusiv — Gold auf Schwarz, für Gala Abende, Award Ceremonies und Events, die beeindrucken sollen.",
    eventType: "corporate",
    colors: { primary: "#C8A951", secondary: "#0D0D0D", accent: "#F5F5DC" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #0D0D0D 0%, #C8A951 100%)",
    tier: "premium",
    premiumFeatureKeys: ["templateCard.countdownTimer", "templateCard.agendaSection", "templateCard.registrationForm"],
    defaultHeroImage: heroCorporateGala,
  },
];

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onDemo: (template: Template) => void;
  demoOnly?: boolean;
}

const TemplateCard = ({ template, onSelect, onDemo, demoOnly = false }: TemplateCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/30"
    >
      <div
        className="h-52 relative overflow-hidden"
        style={{ background: template.previewGradient }}
      >
        {template.defaultHeroImage && (
          <img src={template.defaultHeroImage} alt={template.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-between p-5">
          <div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: template.font, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
              {template.name}
            </p>
            <p className="text-white/70 text-xs font-body mt-0.5">{template.tagline}</p>
          </div>
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20 font-body text-[10px]">
            {t("templateCard.from")} €19
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {template.description}
        </p>

        {template.premiumFeatureKeys && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {template.premiumFeatureKeys.slice(0, 4).map((key) => (
              <span key={key} className="text-[10px] font-body bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {t(key)}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {!demoOnly && (
            <Button size="sm" className="flex-1 font-body" onClick={() => onSelect(template)}>
              {t("templates.select")}
            </Button>
          )}
          <button
            className={`inline-flex items-center justify-center gap-2 font-body text-xs tracking-wide rounded-full border border-border px-5 py-2.5 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-foreground hover:bg-primary/5 ${demoOnly ? "flex-1" : ""}`}
            onClick={() => onDemo(template)}
          >
            <Eye className="w-3.5 h-3.5" />
            {t("templateCard.demoView")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
