import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-body text-xs gap-1 px-2"
      onClick={() => setLocale(locale === "de" ? "en" : "de")}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "de" ? "EN" : "DE"}
    </Button>
  );
};

export default LanguageSwitcher;
