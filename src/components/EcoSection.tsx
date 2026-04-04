import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";
import { Leaf, TreePine, Recycle } from "lucide-react";

const EcoSection = () => {
  const { t } = useTranslation();

  const badges = [
    { icon: TreePine, label: t("eco.badge1") },
    { icon: Recycle, label: t("eco.badge2") },
    { icon: Leaf, label: t("eco.badge3") },
  ];

  return (
    <section className="py-14 sm:py-24 bg-emerald-50/50 dark:bg-emerald-950/10">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mx-auto mb-4 sm:mb-6" />
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {t("eco.title")}
          </h2>
          <p className="font-body text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10">
            {t("eco.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
                className="flex items-center gap-2 bg-background border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-2 sm:px-5 sm:py-2.5"
              >
                <badge.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="font-body text-xs sm:text-sm font-medium text-foreground">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EcoSection;
