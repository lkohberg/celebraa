import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard, { templates, Template } from "@/components/TemplateCard";
import DemoPreview from "@/components/DemoPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Layers } from "lucide-react";
import { useTranslation } from "@/i18n";

const eventTypes = [
  { value: "birthday", labelKey: "templates.birthday" },
  { value: "wedding", labelKey: "templates.wedding" },
  { value: "corporate", labelKey: "templates.corporate" },
] as const;

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"basis" | "premium">("premium");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("nav.back")}
          </Button>
          <span className="font-display text-lg font-bold text-foreground">
            celebra<span className="text-primary">.at</span>
          </span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("templates.title")}
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            {t("templates.subtitle")}
          </p>
        </motion.div>

        {/* Tier Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
            <button
              onClick={() => setSelectedTier("basis")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-body text-sm font-medium transition-all ${
                selectedTier === "basis"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-4 h-4" />
              {t("templates.basis")} · €49
            </button>
            <button
              onClick={() => setSelectedTier("premium")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-body text-sm font-medium transition-all ${
                selectedTier === "premium"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Crown className="w-4 h-4" />
              {t("templates.premium")} · €99
            </button>
          </div>
        </div>

        <Tabs defaultValue="birthday" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-10">
            {eventTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="font-body">
                {t(type.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          {eventTypes.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              <div className="grid md:grid-cols-3 gap-6">
                {templates
                  .filter((tpl) => tpl.eventType === type.value && tpl.tier === selectedTier)
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={(t) => navigate(`/packages?templateId=${t.id}&eventType=${t.eventType}`)}
                      onDemo={(t) => { setDemoTemplate(t); setDemoOpen(true); }}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <DemoPreview template={demoTemplate} open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
};

export default TemplatesPage;
