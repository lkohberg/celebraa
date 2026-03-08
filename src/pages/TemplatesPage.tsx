import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard, { templates, Template } from "@/components/TemplateCard";
import DemoPreview from "@/components/DemoPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, PartyPopper, Building2, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n";

const eventTypes = [
  { value: "birthday", labelKey: "templates.birthday", icon: PartyPopper, color: "hsl(340, 65%, 50%)" },
  { value: "wedding", labelKey: "templates.wedding", icon: Heart, color: "hsl(150, 18%, 38%)" },
  { value: "corporate", labelKey: "templates.corporate", icon: Building2, color: "hsl(220, 50%, 35%)" },
] as const;

const categoryDescriptionKeys: Record<string, string> = {
  birthday: "templates.cat.birthday",
  wedding: "templates.cat.wedding",
  corporate: "templates.cat.corporate",
};

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("birthday");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> {t("nav.back")}
          </Button>
          <span className="font-display text-lg font-bold text-foreground">
            celebra<span className="text-primary">.at</span>
          </span>
        </div>
      </nav>

      {/* Hero area */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(hsl(38, 65%, 50%) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(38, 65%, 50%), transparent)" }} />
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(340, 65%, 50%), transparent)" }} />

        <div className="container mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary font-body text-xs tracking-wide mb-6">
              <Sparkles className="w-3 h-3" />
              {t("templates.handpicked")}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("templates.title")}
            </h1>
            <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
              {t("templates.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
            {eventTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="font-body gap-1.5">
                <type.icon className="w-3.5 h-3.5" />
                {t(type.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Category description */}
          <motion.p
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-body text-sm text-muted-foreground mb-10 max-w-lg mx-auto"
          >
            {t(categoryDescriptionKeys[activeTab])}
          </motion.p>

          {eventTypes.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {templates
                  .filter((tpl) => tpl.eventType === type.value)
                  .map((template, idx) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <TemplateCard
                        template={template}
                        onSelect={(t) => navigate(`/order/${t.id}`)}
                        onDemo={(t) => { setDemoTemplate(t); setDemoOpen(true); }}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <DemoPreview template={demoTemplate} open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
};

export default TemplatesPage;
