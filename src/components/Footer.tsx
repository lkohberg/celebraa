import { useTranslation } from "@/i18n";

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
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t("footer.imprint")}
          </a>
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t("footer.privacy")}
          </a>
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t("footer.terms")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
