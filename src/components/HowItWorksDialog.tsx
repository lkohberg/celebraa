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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-display text-xl sm:text-2xl text-center">
            {t("howItWorks.title")}
          </DialogTitle>
          <p className="font-body text-xs sm:text-sm text-muted-foreground text-center mt-1">
            {t("howItWorks.subtitle")}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4 sm:mt-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-xl ${step.bg}`}
            >
              {/* Step number badge */}
              <div className="absolute -top-2 -left-1 sm:static w-6 h-6 sm:w-auto sm:h-auto">
                <span className="sm:hidden inline-flex items-center justify-center w-6 h-6 rounded-full bg-background text-[10px] font-bold text-muted-foreground shadow-sm border border-border/50">
                  {index + 1}
                </span>
              </div>

              <div className={`w-12 h-12 sm:w-10 sm:h-10 rounded-xl sm:rounded-lg flex items-center justify-center shrink-0 bg-background shadow-sm`}>
                <step.icon className={`w-6 h-6 sm:w-5 sm:h-5 ${step.color}`} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-sm font-semibold text-foreground">{t(step.titleKey)}</h3>
                <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            {t("howItWorks.price")} <span className="font-semibold text-primary">€19</span> · {t("howItWorks.priceNote")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
