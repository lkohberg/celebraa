import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Palette, Package, Eye, User, CreditCard, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Palette,
    title: "1. Design wählen",
    description: "Wähle aus unseren Premium-Designs für Hochzeiten, Geburtstage oder Business-Events. Jedes Design ist individuell anpassbar.",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    icon: Package,
    title: "2. Blöcke & Pakete",
    description: "Stelle deine Event-Seite individuell zusammen. Wähle ein vorteilhaftes Paket oder einzelne Blöcke wie Timeline, Essensmenü, Dresscode und mehr.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: Eye,
    title: "3. Live-Vorschau",
    description: "Sieh dir eine Vorschau deiner Event-Seite mit allen gewählten Blöcken an, bevor du bezahlst. So weißt du genau, was du bekommst.",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    icon: User,
    title: "4. Kontaktdaten",
    description: "Gib deinen Namen und deine E-Mail-Adresse an, damit wir dich über den Status informieren können.",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/20",
  },
  {
    icon: CreditCard,
    title: "5. Sicher bezahlen",
    description: "Bezahle sicher über Stripe mit Kreditkarte, Apple Pay oder Google Pay. Einmalzahlung – kein Abo.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
  },
  {
    icon: PartyPopper,
    title: "6. Fertig!",
    description: "Deine Event-Seite ist sofort verfügbar (oder nach kurzer Bearbeitung bei individuellen Blöcken). Teile den Link mit deinen Gästen!",
    color: "text-primary",
    bg: "bg-primary/5",
  },
];

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">
            Wie funktioniert's?
          </DialogTitle>
          <p className="font-body text-sm text-muted-foreground text-center mt-1">
            In 6 einfachen Schritten zu deiner perfekten Event-Seite
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-start gap-4 p-4 rounded-xl ${step.bg}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-background shadow-sm`}>
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            Ab nur <span className="font-semibold text-primary">€19</span> · Einmalzahlung · Kein Abo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
