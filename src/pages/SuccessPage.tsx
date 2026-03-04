import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, ExternalLink, Check } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

const SuccessPage = () => {
  const { eventLink } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const eventUrl = `https://${eventLink}.celebra.at`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          Deine Event-Seite ist live!
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-10">
          Teile deinen Link oder lade den QR-Code herunter
        </p>

        {/* QR Code */}
        <div ref={qrRef} className="inline-block p-6 bg-card rounded-xl shadow-card mb-8">
          <QRCodeSVG
            value={eventUrl}
            size={180}
            bgColor="transparent"
            fgColor="hsl(220, 20%, 14%)"
            level="H"
          />
        </div>

        <p className="font-body text-sm text-muted-foreground mb-6 break-all">
          {eventUrl}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleCopy} className="font-body">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Kopiert!" : "Link kopieren"}
          </Button>
          <Button variant="outline" onClick={handleDownloadQR} className="font-body">
            <Download className="w-4 h-4 mr-2" />
            QR-Code herunterladen
          </Button>
          <Button variant="outline" asChild className="font-body">
            <a href={eventUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Zur Event-Seite
            </a>
          </Button>
        </div>

        <div className="mt-12">
          <Button variant="ghost" onClick={() => navigate("/")} className="font-body text-muted-foreground">
            Zurück zur Startseite
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
