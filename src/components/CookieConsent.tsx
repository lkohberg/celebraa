import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-lg mx-auto bg-card border border-border rounded-xl shadow-lg p-5 flex flex-col sm:flex-row items-center gap-4">
            <p className="font-body text-sm text-muted-foreground flex-1 text-center sm:text-left">
              {t("cookie.message")}
            </p>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={handleDecline} className="font-body">
                {t("cookie.decline")}
              </Button>
              <Button size="sm" onClick={handleAccept} className="font-body">
                {t("cookie.accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
