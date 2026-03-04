import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useTranslation } from "@/i18n";

interface PriceSummaryProps {
  templateName: string;
  basePrice: number;
  menuSelection: boolean;
  menuPrice: number;
  totalPrice: number;
  isValid: boolean;
  loading: boolean;
  onSubmit: () => void;
  tier?: "basis" | "premium";
}

const PriceSummary = ({ templateName, basePrice, menuSelection, menuPrice, totalPrice, isValid, loading, onSubmit, tier = "basis" }: PriceSummaryProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-lg font-semibold text-foreground">{t("price.summary")}</h4>
        {tier === "premium" && (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 gap-1 font-body text-xs">
            <Crown className="w-3 h-3" />
            {t("price.tier.premium")}
          </Badge>
        )}
      </div>
      <div className="flex justify-between font-body text-sm">
        <span className="text-muted-foreground">{templateName} {t("price.template")}</span>
        <span className="text-foreground">€{basePrice}</span>
      </div>
      {menuSelection && (
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">{t("price.menu")}</span>
          <span className="text-foreground">€{menuPrice}</span>
        </div>
      )}
      <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
        <span className="text-foreground">{t("price.total")}</span>
        <span className="text-primary text-lg">€{totalPrice}</span>
      </div>
      <Button
        className="w-full mt-2 font-body font-semibold text-base py-5"
        disabled={!isValid || loading}
        onClick={onSubmit}
      >
        {loading ? t("price.processing") : t("price.pay")}
      </Button>
      <p className="text-xs text-muted-foreground text-center font-body">
        {t("price.stripe")}
      </p>
    </div>
  );
};

export default PriceSummary;
