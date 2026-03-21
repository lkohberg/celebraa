import { useTranslation } from "@/i18n";
import LegalDialogs from "./LegalDialogs";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <span className="font-display text-lg font-bold text-foreground">
          celebra<span className="text-primary">.at</span>
        </span>
        <p className="font-body text-sm text-muted-foreground mt-3">
          © {new Date().getFullYear()} Celebra.at · {t("footer.tagline")}
        </p>
        <p className="font-body text-[10px] text-muted-foreground mt-1">
          {t("uptime.legal")}
        </p>
        </span>
        <p className="font-body text-sm text-muted-foreground mt-3">
          © {new Date().getFullYear()} Celebra.at · {t("footer.tagline")}
        </p>
        <LegalDialogs />
      </div>
    </footer>
  );
};

export default Footer;
