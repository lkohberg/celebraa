import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { Globe, Copy, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/i18n/eventLabels";

const LanguageLinks = ({ event }: { event: any }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const languages = event.languages as string[] | undefined;
  if (!languages || languages.length <= 1) return null;

  const handleCopy = async (url: string, code: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mb-4">
      <p className="font-body text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
        <Globe className="w-3 h-3" /> {t("dashboard.languageLinks")}
      </p>
      <div className="space-y-1">
        {languages.map((code) => {
          const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label || code;
          const url = `${window.location.origin}/${event.event_link}/${code}`;
          return (
            <div key={code} className="flex items-center gap-2 font-body text-sm">
              <span className="text-muted-foreground">{langLabel}:</span>
              <code className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded truncate max-w-[200px]">{url}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCopy(url, code)}>
                {copied === code ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageLinks;
