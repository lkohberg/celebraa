import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";
import { BadgePercent, Gem, QrCode, Globe, LayoutDashboard, FileSpreadsheet } from "lucide-react";

const usps = [
  { key: "cheap", icon: BadgePercent },
  { key: "quality", icon: Gem },
  { key: "qr", icon: QrCode },
  { key: "language", icon: Globe },
  { key: "dashboard", icon: LayoutDashboard },
  { key: "export", icon: FileSpreadsheet },
];

const USPSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-24">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{t("usp.title")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 * i }}
              className="rounded-xl border border-border bg-card p-4 sm:p-6 hover:shadow-card-hover transition-shadow"
            >
              <usp.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3 sm:mb-4" />
              <h3 className="font-display text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{t(`usp.${usp.key}.title`)}</h3>
              <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">{t(`usp.${usp.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
