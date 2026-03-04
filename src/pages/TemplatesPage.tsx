import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard, { templates, Template } from "@/components/TemplateCard";
import DemoPreview from "@/components/DemoPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const eventTypes = [
  { value: "birthday", label: "Geburtstag" },
  { value: "wedding", label: "Hochzeit" },
  { value: "corporate", label: "Firmen Event" },
] as const;

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Zurück
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
            Wähle dein Design
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            Für jeden Anlass das passende Template
          </p>
        </motion.div>

        <Tabs defaultValue="birthday" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-10">
            {eventTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value} className="font-body">
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {eventTypes.map((type) => (
            <TabsContent key={type.value} value={type.value}>
              <div className="grid md:grid-cols-3 gap-6">
                {templates
                  .filter((t) => t.eventType === type.value)
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={(t) => navigate(`/configure/${t.id}`)}
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
