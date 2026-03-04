import { motion } from "framer-motion";
import { useTranslation } from "@/i18n";
import { Check, X, Minus } from "lucide-react";

type CellValue = "yes" | "no" | "partial";

const rows: { key: string; paper: CellValue; whatsapp: CellValue; celebra: CellValue }[] = [
  { key: "cost", paper: "no", whatsapp: "yes", celebra: "yes" },
  { key: "design", paper: "partial", whatsapp: "no", celebra: "yes" },
  { key: "rsvp", paper: "no", whatsapp: "partial", celebra: "yes" },
  { key: "qrCode", paper: "no", whatsapp: "no", celebra: "yes" },
  { key: "menu", paper: "no", whatsapp: "no", celebra: "yes" },
  { key: "multilang", paper: "no", whatsapp: "partial", celebra: "yes" },
  { key: "eco", paper: "no", whatsapp: "yes", celebra: "yes" },
  { key: "dashboard", paper: "no", whatsapp: "no", celebra: "yes" },
  { key: "export", paper: "no", whatsapp: "no", celebra: "yes" },
  { key: "guestMgmt", paper: "no", whatsapp: "no", celebra: "yes" },
];

const CellIcon = ({ value }: { value: CellValue }) => {
  if (value === "yes") return <Check className="w-5 h-5 text-emerald-500 mx-auto" />;
  if (value === "partial") return <Minus className="w-5 h-5 text-amber-500 mx-auto" />;
  return <X className="w-5 h-5 text-destructive/60 mx-auto" />;
};

const ComparisonTable = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("comparison.title")}
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-lg mx-auto">
            {t("comparison.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto -mx-6 px-6 overflow-x-auto"
        >
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr>
                <th className="text-left font-body text-xs sm:text-sm text-muted-foreground py-3 px-2 sm:px-4">{t("comparison.feature")}</th>
                <th className="text-center font-body text-xs sm:text-sm text-muted-foreground py-3 px-2 sm:px-4 w-16 sm:w-24">{t("comparison.paper")}</th>
                <th className="text-center font-body text-xs sm:text-sm text-muted-foreground py-3 px-2 sm:px-4 w-16 sm:w-24">WhatsApp</th>
                <th className="text-center font-body text-xs sm:text-sm font-semibold text-primary py-3 px-2 sm:px-4 w-20 sm:w-28">celebra.at</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.key}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="border-t border-border"
                >
                  <td className="font-body text-xs sm:text-sm text-foreground py-3 px-2 sm:px-4">{t(`comparison.row.${row.key}`)}</td>
                  <td className="py-3 px-2 sm:px-4"><CellIcon value={row.paper} /></td>
                  <td className="py-3 px-2 sm:px-4"><CellIcon value={row.whatsapp} /></td>
                  <td className="py-3 px-2 sm:px-4 bg-primary/5"><CellIcon value={row.celebra} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
