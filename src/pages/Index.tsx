import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateCard, { templates, Template } from "@/components/TemplateCard";
import DemoPreview from "@/components/DemoPreview";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, LogIn } from "lucide-react";

const eventTypes = [
  { value: "birthday", label: "Geburtstag" },
  { value: "wedding", label: "Hochzeit" },
  { value: "corporate", label: "Firmen Event" },
] as const;

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleSelect = (template: Template) => {
    navigate(`/configure/${template.id}`);
  };

  const handleDemo = (template: Template) => {
    setDemoTemplate(template);
    setDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold text-foreground">
            celebra<span className="text-primary">.at</span>
          </span>
          <div className="flex gap-4 items-center">
            <a href="#templates" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Templates</a>
            <a href="#features" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Features</a>
            {user ? (
              <Button size="sm" variant="outline" className="font-body" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="font-body" onClick={() => setAuthOpen(true)}>
                <LogIn className="w-4 h-4 mr-1" /> Anmelden
              </Button>
            )}
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeatureGrid />

      {/* Template Selection */}
      <section id="templates" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Wähle dein Design
            </h2>
            <p className="font-body text-muted-foreground text-lg max-w-md mx-auto">
              Für jeden Anlass das passende Template
            </p>
          </motion.div>

          <Tabs defaultValue="birthday" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-10">
              {eventTypes.map((type) => (
                <TabsTrigger
                  key={type.value}
                  value={type.value}
                  className="font-body"
                >
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
                        onSelect={handleSelect}
                        onDemo={handleDemo}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <DemoPreview
        template={demoTemplate}
        open={demoOpen}
        onOpenChange={setDemoOpen}
      />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <Footer />
    </div>
  );
};

export default Index;
