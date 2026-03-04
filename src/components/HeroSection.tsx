import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body font-medium text-muted-foreground">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
            {t("hero.title1")}
            <br />
            <span className="text-primary">{t("hero.title2")}</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            {t("hero.subtitle")}
          </p>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 font-body font-semibold"
              onClick={() => navigate("/templates")}
            >
              {t("hero.cta")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 font-body font-semibold"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("hero.secondary")}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20"
        >
          <div className="inline-flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground font-body flex-wrap justify-center">
            <span>{t("hero.trust1")}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
            <span>{t("hero.trust2")}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
            <span>{t("hero.trust3")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
