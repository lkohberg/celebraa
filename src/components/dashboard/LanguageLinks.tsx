import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { Globe, Copy, Check, Download } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/i18n/eventLabels";
import { QRCodeSVG } from "qrcode.react";

const LanguageLinks = ({ event }: { event: any }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const languages = event.languages as string[] | undefined;
  if (!languages || languages.length <= 1) return null;

  const handleCopy = async (url: string, code: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadQR = (code: string, url: string) => {
    const container = qrRefs.current[code];
    const svg = container?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `qr-${event.event_link}-${code}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="mb-4">
      <p className="font-body text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
        <Globe className="w-3 h-3" /> {t("dashboard.languageLinks")}
      </p>
      <div className="space-y-3">
        {languages.map((code) => {
          const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label || code;
          const url = `${window.location.origin}/${event.event_link}/${code}`;
          return (
            <div key={code} className="space-y-1">
              <div className="flex items-center gap-2 font-body text-sm">
                <span className="text-muted-foreground">{langLabel}:</span>
                <code className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded truncate max-w-[200px]">{url}</code>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCopy(url, code)}>
                  {copied === code ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div ref={(el) => { qrRefs.current[code] = el; }} className="inline-block bg-card p-2 rounded-lg">
                  <QRCodeSVG value={url} size={80} bgColor="transparent" fgColor="hsl(220, 20%, 14%)" level="H" />
                </div>
                <Button variant="ghost" size="sm" className="h-7 font-body text-xs" onClick={() => handleDownloadQR(code, url)}>
                  <Download className="w-3 h-3 mr-1" /> QR
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageLinks;
