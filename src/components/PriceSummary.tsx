import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown } from "lucide-react";
import { useTranslation } from "@/i18n";
import LegalDialogs from "@/components/LegalDialogs";

interface PriceSummaryProps {
  templateName: string;
  basePrice: number;
  menuSelection: boolean;
  menuPrice: number;
  extraLangs?: number;
  langPrice?: number;
  totalPrice: number;
  isValid: boolean;
  loading: boolean;
  onSubmit: () => void;
  tier?: "basis" | "premium";
}

const PriceSummary = ({ templateName, basePrice, menuSelection, menuPrice, extraLangs = 0, langPrice = 0, totalPrice, isValid, loading, onSubmit, tier = "basis" }: PriceSummaryProps) => {
  const { t } = useTranslation();
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      {extraLangs > 0 && (
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">{t("price.languages")} ({extraLangs}×€3)</span>
          <span className="text-foreground">€{langPrice}</span>
        </div>
      )}
      <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
        <span className="text-foreground">{t("price.total")}</span>
        <span className="text-primary text-lg">€{totalPrice}</span>
      </div>

      <div className="flex items-start gap-2 pt-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="mt-0.5"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground font-body leading-relaxed cursor-pointer">
          <LegalDialogs
            inline
            renderTrigger={(openDialog) => (
              <>
                {t("price.termsAccept")}{" "}
                <button type="button" onClick={() => openDialog("terms")} className="underline hover:text-foreground transition-colors">{t("footer.terms")}</button>
                {" "}&{" "}
                <button type="button" onClick={() => openDialog("privacy")} className="underline hover:text-foreground transition-colors">{t("footer.privacy")}</button>
              </>
            )}
          />
        </label>
      </div>

      <Button
        className="w-full mt-2 font-body font-semibold text-base py-5"
        disabled={!isValid || loading || !termsAccepted}
        onClick={onSubmit}
      >
        {loading ? t("price.processing") : t("price.pay")}
      </Button>
      <p className="text-xs text-muted-foreground text-center font-body">
        {t("price.stripe")}
      </p>
      <p className="text-[10px] text-muted-foreground text-center font-body mt-1">
        {t("uptime.legal")}
      </p>
    </div>
  );
};

export default PriceSummary;
