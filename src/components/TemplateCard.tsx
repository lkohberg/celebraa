import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  description: string;
  eventType: "birthday" | "wedding" | "corporate";
  colors: { primary: string; secondary: string; accent: string };
  font: string;
  previewGradient: string;
}

export const templates: Template[] = [
  // Birthday
  {
    id: "birthday-elegant-gold",
    name: "Elegant Gold",
    description: "Zeitlos elegant mit goldenen Akzenten",
    eventType: "birthday",
    colors: { primary: "#C8A951", secondary: "#FFF8E7", accent: "#1A1A1A" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FFF8E7 0%, #C8A951 100%)",
  },
  {
    id: "birthday-modern-black",
    name: "Modern Black",
    description: "Minimalistisch und modern in Schwarz",
    eventType: "birthday",
    colors: { primary: "#1A1A1A", secondary: "#F5F5F5", accent: "#E8C547" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)",
  },
  {
    id: "birthday-boho-nature",
    name: "Boho Nature",
    description: "Natürlich und warm mit Erdtönen",
    eventType: "birthday",
    colors: { primary: "#8B7355", secondary: "#F5EDE0", accent: "#4A6741" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #F5EDE0 0%, #D4C5A9 100%)",
  },
  // Wedding
  {
    id: "wedding-elegant-gold",
    name: "Romantik Gold",
    description: "Klassisch romantisch mit Goldakzenten",
    eventType: "wedding",
    colors: { primary: "#B8965A", secondary: "#FDF6EC", accent: "#2C2C2C" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FDF6EC 0%, #E8D5B0 100%)",
  },
  {
    id: "wedding-modern-minimal",
    name: "Modern Minimal",
    description: "Schlicht und stilvoll in Weiß",
    eventType: "wedding",
    colors: { primary: "#333333", secondary: "#FFFFFF", accent: "#C9A96E" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
  },
  {
    id: "wedding-garden-blush",
    name: "Garden Blush",
    description: "Zartes Rosa mit floralen Akzenten",
    eventType: "wedding",
    colors: { primary: "#D4A0A0", secondary: "#FFF0F0", accent: "#5C7A5C" },
    font: "Playfair Display",
    previewGradient: "linear-gradient(135deg, #FFF0F0 0%, #F5D5D5 100%)",
  },
  // Corporate
  {
    id: "corporate-professional",
    name: "Professional Blue",
    description: "Seriös und professionell für Business Events",
    eventType: "corporate",
    colors: { primary: "#1E3A5F", secondary: "#F0F4F8", accent: "#C8A951" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #F0F4F8 0%, #D1DCE8 100%)",
  },
  {
    id: "corporate-dark-elegance",
    name: "Dark Elegance",
    description: "Dunkel und elegant für exklusive Events",
    eventType: "corporate",
    colors: { primary: "#0D0D0D", secondary: "#1A1A2E", accent: "#E8C547" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #1A1A2E 0%, #0D0D0D 100%)",
  },
  {
    id: "corporate-fresh-green",
    name: "Fresh Green",
    description: "Frisch und nachhaltig für moderne Firmen",
    eventType: "corporate",
    colors: { primary: "#2D6A4F", secondary: "#F0F7F4", accent: "#1A1A1A" },
    font: "DM Sans",
    previewGradient: "linear-gradient(135deg, #F0F7F4 0%, #D8E8DF 100%)",
  },
];

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  onDemo: (template: Template) => void;
}

const TemplateCard = ({ template, onSelect, onDemo }: TemplateCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Preview */}
      <div
        className="h-48 relative overflow-hidden"
        style={{ background: template.previewGradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <p
              className="text-2xl font-bold opacity-80"
              style={{
                fontFamily: template.font,
                color: template.colors.primary === "#FFFFFF" || template.colors.secondary === "#FFFFFF"
                  ? template.colors.accent
                  : template.colors.primary,
              }}
            >
              {template.name}
            </p>
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {template.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-5">
          {template.description}
        </p>
        <div className="flex gap-3">
          <Button
            size="sm"
            className="flex-1 font-body"
            onClick={() => onSelect(template)}
          >
            Dieses Design wählen
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
