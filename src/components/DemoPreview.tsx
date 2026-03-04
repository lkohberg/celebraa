import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/components/TemplateCard";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface DemoPreviewProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoPreview = ({ template, open, onOpenChange }: DemoPreviewProps) => {
  const navigate = useNavigate();

  if (!template) return null;

  const eventTypeLabels = {
    birthday: "Geburtstag",
    wedding: "Hochzeit",
    corporate: "Firmen Event",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Demo: {template.name}
          </DialogTitle>
        </DialogHeader>

        {/* Preview Card */}
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
