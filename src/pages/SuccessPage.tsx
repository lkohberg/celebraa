import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, ExternalLink, Check, Clock } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useEventByLink } from "@/hooks/useEvents";
import { SUPPORTED_LANGUAGES } from "@/i18n/eventLabels";
import { useTranslation } from "@/i18n";

const SuccessPage = () => {
  const { eventLink } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPending = searchParams.get("pending") === "true";
  const [copied, setCopied] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const { data: event } = useEventByLink(eventLink || "");

  const languages = (event as any)?.languages as string[] | undefined;
  const hasMultipleLangs = languages && languages.length > 1;

  const baseUrl = `${window.location.origin}/${eventLink}`;
  const primaryUrl = hasMultipleLangs ? `${baseUrl}/${languages[0]}` : baseUrl;

  const handleCopy = async (url: string, key: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
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
      a.download = `qr-${eventLink}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Pending manual review
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="container max-w-lg mx-auto px-6 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Danke für deine Bestellung!
          </h1>
          <p className="font-body text-muted-foreground text-lg mb-4">
            Deine Event-Seite enthält individuelle Elemente, die von unserem Team bearbeitet werden.
          </p>
          <p className="font-body text-muted-foreground mb-10">
            Wir melden uns in Kürze bei dir per E-Mail. Sobald alles fertig ist, findest du deine Seite in deinem Dashboard.
          </p>

          <div className="bg-secondary rounded-xl p-6 mb-8 text-left space-y-2">
            <h3 className="font-display text-sm font-semibold text-foreground">Was passiert jetzt?</h3>
            <div className="flex items-start gap-3 font-body text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Unser Team bearbeitet deine individuellen Blöcke (z.B. Illustration, Musik).</span>
            </div>
            <div className="flex items-start gap-3 font-body text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Du erhältst eine E-Mail, sobald deine Seite fertig ist.</span>
            </div>
            <div className="flex items-start gap-3 font-body text-sm text-muted-foreground">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Deine Event-Seite erscheint dann in deinem Dashboard und ist live.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/dashboard")} className="font-body">
              Zum Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="font-body text-muted-foreground">
              Zur Startseite
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="container max-w-lg mx-auto px-6 py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          {t("success.title")}
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-10">
          {t("success.subtitle")}
        </p>

        {/* QR Code */}
        <div ref={qrRef} className="inline-block p-6 bg-card rounded-xl shadow-card mb-8">
          <QRCodeSVG
            value={primaryUrl}
            size={180}
            bgColor="transparent"
            fgColor="hsl(220, 20%, 14%)"
            level="H"
          />
        </div>

        {/* Language Links */}
        {hasMultipleLangs ? (
          <div className="space-y-3 mb-8">
            <p className="font-body text-sm text-muted-foreground font-semibold mb-2">{t("success.languageLinks")}</p>
            {languages.map((code) => {
              const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
              const url = `${baseUrl}/${code}`;
              return (
                <div key={code} className="flex items-center gap-2 justify-center">
                  <span className="text-sm">{lang?.flag}</span>
                  <span className="font-body text-xs text-muted-foreground break-all">{url}</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleCopy(url, code)}>
                    {copied === code ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-body text-sm text-muted-foreground mb-6 break-all">
            {primaryUrl}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => handleCopy(primaryUrl, "main")} className="font-body">
            {copied === "main" ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied === "main" ? t("success.copied") : t("success.copyLink")}
          </Button>
          <Button variant="outline" onClick={handleDownloadQR} className="font-body">
            <Download className="w-4 h-4 mr-2" />
            {t("success.downloadQr")}
          </Button>
          <Button variant="outline" asChild className="font-body">
            <a href={primaryUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("success.openEvent")}
            </a>
          </Button>
        </div>

        <div className="mt-12">
          <Button variant="ghost" onClick={() => navigate("/")} className="font-body text-muted-foreground">
            {t("success.backHome")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
