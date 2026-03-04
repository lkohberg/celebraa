import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { templates } from "@/components/TemplateCard";
import { useTranslation } from "@/i18n";
import {
  BASE_PRICE,
  blocks,
  packages,
  calculatePricing,
  type EventType,
} from "@/pricing/pricing";

const PackageSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const templateId = searchParams.get("templateId") ?? "";
  const eventType = (searchParams.get("eventType") ?? "birthday") as EventType;

  const template = templates.find((tpl) => tpl.id === templateId);

  const [mode, setMode] = useState<"packages" | "custom">("packages");
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);

  const eventPackages = packages[eventType] ?? [];
  const eventBlocks = blocks[eventType] ?? [];

  const pricing = useMemo(() => {
    if (mode === "packages" && selectedPackageId) {
      return calculatePricing(eventType, [], selectedPackageId);
    }
    if (mode === "custom") {
      return calculatePricing(eventType, selectedBlockIds);
    }
    return { base: BASE_PRICE, addons: 0, total: BASE_PRICE };
  }, [mode, selectedPackageId, selectedBlockIds, eventType]);

  const isValid =
    (mode === "packages" && !!selectedPackageId) ||
    (mode === "custom" && selectedBlockIds.length > 0);

  const toggleBlock = (blockId: string) => {
    setSelectedBlockIds((prev) =>
      prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]
    );
  };

  const handleNext = () => {
    navigate("/checkout-details", {
      state: {
        templateId,
        eventType,
        selectedPackageId: mode === "packages" ? selectedPackageId : undefined,
        selectedBlocks: mode === "custom" ? selectedBlockIds : [],
        pricing,
        templateName: template?.name ?? templateId,
      },
    });
  };

  const selectedPackage = eventPackages.find((p) => p.id === selectedPackageId);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/templates")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("nav.back")}
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
            {t("packages.title")}
          </h1>
          <p className="font-body text-muted-foreground text-lg text-center mb-10">
            {t("packages.subtitle")}
          </p>

          {/* Template preview bar */}
          {template && (
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border mb-8 shadow-sm">
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0"
                style={{ background: template.previewGradient }}
              />
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">{template.name}</p>
                <p className="font-body text-sm text-muted-foreground">{template.description}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-muted-foreground">{t("packages.base")}</p>
                <p className="font-display font-bold text-foreground">€{BASE_PRICE}</p>
              </div>
            </div>
          )}

          {/* Mode tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
              <button
                onClick={() => setMode("packages")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-body text-sm font-medium transition-all ${
                  mode === "packages"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package className="w-4 h-4" />
                {t("packages.tabPackages")}
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-body text-sm font-medium transition-all ${
                  mode === "custom"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sliders className="w-4 h-4" />
                {t("packages.tabCustom")}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Left / main content */}
            <div className="md:col-span-2 space-y-4">
              {mode === "packages" ? (
                <>
                  {eventPackages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <motion.div
                        key={pkg.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <h3 className="font-display font-semibold text-foreground">
                              {t(pkg.nameKey)}
                            </h3>
                          </div>
                          <Badge variant="outline" className="font-body font-bold text-primary border-primary">
                            €{pkg.price}
                          </Badge>
                        </div>
                        <div className="ml-8 flex flex-wrap gap-1.5">
                          {pkg.includedBlockIds.map((blockId) => {
                            const block = eventBlocks.find((b) => b.id === blockId);
                            if (!block) return null;
                            return (
                              <span
                                key={blockId}
                                className="text-xs font-body bg-secondary text-muted-foreground px-2 py-0.5 rounded-full"
                              >
                                {t(block.labelKey)}
                              </span>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                  {eventBlocks.map((block) => {
                    const checked = selectedBlockIds.includes(block.id);
                    return (
                      <div
                        key={block.id}
                        className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`block-${block.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleBlock(block.id)}
                          />
                          <label
                            htmlFor={`block-${block.id}`}
                            className="font-body text-sm text-foreground cursor-pointer"
                          >
                            {t(block.labelKey)}
                          </label>
                        </div>
                        <span className="font-body text-sm text-muted-foreground">
                          +€{block.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price summary */}
            <div className="space-y-4">
              <div className="bg-secondary rounded-xl p-5 space-y-3 sticky top-24">
                <h4 className="font-display font-semibold text-foreground">
                  {t("packages.total")}
                </h4>

                {/* Base */}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">{t("packages.base")}</span>
                  <span className="text-foreground">€{BASE_PRICE}</span>
                </div>

                {/* Package or blocks */}
                {mode === "packages" && selectedPackage ? (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">{t(selectedPackage.nameKey)}</span>
                    <span className="text-foreground">+€{selectedPackage.price - BASE_PRICE}</span>
                  </div>
                ) : mode === "custom" && selectedBlockIds.length > 0 ? (
                  selectedBlockIds.map((blockId) => {
                    const block = eventBlocks.find((b) => b.id === blockId);
                    if (!block) return null;
                    return (
                      <div key={blockId} className="flex justify-between font-body text-sm">
                        <span className="text-muted-foreground">{t(block.labelKey)}</span>
                        <span className="text-foreground">+€{block.price}</span>
                      </div>
                    );
                  })
                ) : null}

                <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
                  <span className="text-foreground">{t("packages.total")}</span>
                  <span className="text-primary text-lg">€{pricing.total}</span>
                </div>

                {!isValid && (
                  <p className="text-xs text-muted-foreground font-body text-center">
                    {t("packages.selectHint")}
                  </p>
                )}

                <Button
                  className="w-full font-body font-semibold text-base py-5"
                  disabled={!isValid}
                  onClick={handleNext}
                >
                  {t("packages.next")} →
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageSelectionPage;
