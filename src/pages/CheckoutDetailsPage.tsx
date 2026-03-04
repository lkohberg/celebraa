import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LegalDialogs from "@/components/LegalDialogs";
import type { EventType } from "@/pricing/pricing";

interface OrderState {
  templateId: string;
  eventType: EventType;
  selectedPackageId?: string;
  selectedBlocks: string[];
  pricing: { base: number; addons: number; total: number };
  templateName: string;
}

const CheckoutDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const orderState = location.state as OrderState | undefined;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // If no order state, redirect back
  if (!orderState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-body text-muted-foreground">{t("configure.notFound")}</p>
          <Button onClick={() => navigate("/templates")}>{t("configure.backHome")}</Button>
        </div>
      </div>
    );
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.firstName.trim()) newErrors.firstName = t("checkout.firstNameRequired");
    if (!form.lastName.trim()) newErrors.lastName = t("checkout.lastNameRequired");
    if (!form.email.trim()) {
      newErrors.email = t("checkout.emailRequired");
    } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = t("checkout.emailInvalid");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/order-confirmation`;
      const cancelUrl = window.location.href;

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          orderMode: true,
          templateId: orderState.templateId,
          eventType: orderState.eventType,
          packageId: orderState.selectedPackageId,
          selectedBlocks: orderState.selectedBlocks,
          totalPrice: orderState.pricing.total,
          customerFirstName: form.firstName,
          customerLastName: form.lastName,
          customerEmail: form.email,
          successUrl,
          cancelUrl,
        },
      });

      if (error || !data?.url) {
        throw new Error(error?.message ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
      setLoading(false);
    }
  };

  const { pricing, templateName, selectedPackageId, selectedBlocks } = orderState;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("checkout.back")}
          </Button>
          <span className="font-display text-lg font-bold text-foreground">
            celebra<span className="text-primary">.at</span>
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
            {t("checkout.title")}
          </h1>
          <p className="font-body text-muted-foreground text-lg text-center mb-10">
            {t("checkout.subtitle")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-body">
                  {t("checkout.firstName")}
                </Label>
                <Input
                  id="firstName"
                  placeholder={t("checkout.firstNamePlaceholder")}
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive font-body">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-body">
                  {t("checkout.lastName")}
                </Label>
                <Input
                  id="lastName"
                  placeholder={t("checkout.lastNamePlaceholder")}
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive font-body">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-body">
                  {t("checkout.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("checkout.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-body">{errors.email}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground font-body leading-relaxed cursor-pointer"
                >
                  <LegalDialogs
                    inline
                    renderTrigger={(openDialog) => (
                      <>
                        {t("checkout.termsAccept")}{" "}
                        <button
                          type="button"
                          onClick={() => openDialog("terms")}
                          className="underline hover:text-foreground transition-colors"
                        >
                          {t("footer.terms")}
                        </button>{" "}
                        &{" "}
                        <button
                          type="button"
                          onClick={() => openDialog("privacy")}
                          className="underline hover:text-foreground transition-colors"
                        >
                          {t("footer.privacy")}
                        </button>
                      </>
                    )}
                  />
                </label>
              </div>

              <Button
                className="w-full font-body font-semibold text-base py-5"
                disabled={loading || !termsAccepted}
                onClick={handleSubmit}
              >
                {loading ? t("checkout.processing") : t("checkout.submit")}
              </Button>
              <p className="text-xs text-muted-foreground text-center font-body">
                {t("checkout.stripe")}
              </p>
            </div>

            {/* Order summary */}
            <div className="bg-secondary rounded-xl p-5 space-y-3 h-fit">
              <h4 className="font-display font-semibold text-foreground">
                {t("checkout.orderSummary")}
              </h4>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">{t("checkout.template")}</span>
                <span className="text-foreground">{templateName}</span>
              </div>
              {selectedPackageId && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t("checkout.package")}</span>
                  <span className="text-foreground">€{pricing.addons}</span>
                </div>
              )}
              {selectedBlocks.length > 0 && (
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t("checkout.customBlocks")}</span>
                  <span className="text-foreground">{selectedBlocks.length}×</span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">{t("packages.base")}</span>
                <span className="text-foreground">€{pricing.base}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
                <span className="text-foreground">{t("packages.total")}</span>
                <span className="text-primary text-lg">€{pricing.total}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
