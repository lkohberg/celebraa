import { useTranslation } from "@/i18n";
import { useCurrency, CURRENCIES } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useTranslation();
  const { currency, setCurrencyCode } = useCurrency();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="font-body text-xs gap-1 px-2"
        onClick={() => setLocale(locale === "de" ? "en" : "de")}
      >
        <Globe className="w-3.5 h-3.5" />
        {locale === "de" ? "DE" : "EN"}
      </Button>
      <Select value={currency.code} onValueChange={setCurrencyCode}>
        <SelectTrigger className="h-8 w-[80px] font-body text-xs border-0 bg-transparent px-2 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-[120px]">
          {CURRENCIES.map(c => (
            <SelectItem key={c.code} value={c.code} className="font-body text-xs">
              {c.symbol} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
