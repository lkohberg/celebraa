import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Palette, Package, Eye, User, CreditCard, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  const { t } = useTranslation();

  const steps = [
    { icon: Palette, titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/20" },
    { icon: Package, titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/20" },
    { icon: Eye, titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/20" },
    { icon: User, titleKey: "howItWorks.step4.title", descKey: "howItWorks.step4.desc", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/20" },
    { icon: CreditCard, titleKey: "howItWorks.step5.title", descKey: "howItWorks.step5.desc", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
    { icon: PartyPopper, titleKey: "howItWorks.step6.title", descKey: "howItWorks.step6.desc", color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">
            {t("howItWorks.title")}
          </DialogTitle>
          <p className="font-body text-sm text-muted-foreground text-center mt-1">
            {t("howItWorks.subtitle")}
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
                <h3 className="font-display text-sm font-semibold text-foreground">{t(step.titleKey)}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            {t("howItWorks.price")} <span className="font-semibold text-primary">€19</span> · {t("howItWorks.priceNote")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
