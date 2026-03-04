import { Button } from "@/components/ui/button";

interface PriceSummaryProps {
  templateName: string;
  basePrice: number;
  menuSelection: boolean;
  menuPrice: number;
  totalPrice: number;
  isValid: boolean;
  loading: boolean;
  onSubmit: () => void;
}

const PriceSummary = ({ templateName, basePrice, menuSelection, menuPrice, totalPrice, isValid, loading, onSubmit }: PriceSummaryProps) => {
  return (
    <div className="bg-secondary rounded-xl p-6 space-y-3">
      <h4 className="font-display text-lg font-semibold text-foreground">Zusammenfassung</h4>
      <div className="flex justify-between font-body text-sm">
        <span className="text-muted-foreground">{templateName} Template</span>
        <span className="text-foreground">€{basePrice}</span>
      </div>
      {menuSelection && (
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">Menüauswahl</span>
          <span className="text-foreground">€{menuPrice}</span>
        </div>
      )}
      <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
        <span className="text-foreground">Gesamt</span>
        <span className="text-primary text-lg">€{totalPrice}</span>
      </div>
      <Button
        className="w-full mt-2 font-body font-semibold text-base py-5"
        disabled={!isValid || loading}
        onClick={onSubmit}
      >
        {loading ? "Wird verarbeitet..." : "Jetzt sicher bezahlen"}
      </Button>
      <p className="text-xs text-muted-foreground text-center font-body">
        Zahlung via Stripe · Kreditkarte, Apple Pay, Google Pay
      </p>
    </div>
  );
};

export default PriceSummary;
