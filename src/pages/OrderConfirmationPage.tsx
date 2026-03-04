import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          {t("orderConfirmation.title")}
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-4">
          {t("orderConfirmation.subtitle")}
        </p>
        <p className="font-body text-muted-foreground mb-4">
          {t("orderConfirmation.body")}
        </p>

        <div className="flex items-center justify-center gap-2 mb-10 text-muted-foreground">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <p className="font-body text-sm">{t("orderConfirmation.email")}</p>
        </div>

        <Button onClick={() => navigate("/")} className="font-body">
          {t("orderConfirmation.backHome")}
        </Button>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;
