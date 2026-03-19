import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TemplateCard, { templates, Template } from "@/components/TemplateCard";
import DemoPreview from "@/components/DemoPreview";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import ComparisonTable from "@/components/ComparisonTable";
import USPSection from "@/components/USPSection";
import EcoSection from "@/components/EcoSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import HowItWorksDialog from "@/components/HowItWorksDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [demoTemplate, setDemoTemplate] = useState<Template | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: notifCount } = useNotificationCount(user?.id);

  const eventTypes = [
    { value: "birthday", label: t("templates.birthday") },
    { value: "wedding", label: t("templates.wedding") },
    { value: "corporate", label: t("templates.corporate") },
  ] as const;

  const handleSelect = (template: Template) => {
    navigate(`/order/${template.id}`);
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
          <div className="hidden md:flex gap-4 items-center">
            <a href="#templates" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.templates")}</a>
            <a href="#features" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.features")}</a>
            <button onClick={() => setHowItWorksOpen(true)} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.howItWorks")}</button>
            <LanguageSwitcher />
            {user ? (
              <Button size="sm" variant="outline" className="font-body" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="w-4 h-4 mr-1" /> {t("nav.dashboard")}
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="font-body" onClick={() => setAuthOpen(true)}>
                <LogIn className="w-4 h-4 mr-1" /> {t("nav.login")}
              </Button>
            )}
          </div>
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3"
          >
            <a href="#templates" className="block font-body text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{t("nav.templates")}</a>
            <a href="#features" className="block font-body text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>{t("nav.features")}</a>
            <button className="block font-body text-sm text-muted-foreground text-left w-full" onClick={() => { setHowItWorksOpen(true); setMobileMenuOpen(false); }}>{t("nav.howItWorks")}</button>
            {user ? (
              <>
                <Button size="sm" variant="outline" className="w-full font-body" onClick={() => { navigate("/dashboard"); setMobileMenuOpen(false); }}>
                  <LayoutDashboard className="w-4 h-4 mr-1" /> {t("nav.dashboard")}
                </Button>
                <Button size="sm" variant="ghost" className="w-full font-body text-muted-foreground" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-1" /> {t("nav.logout")}
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" className="w-full font-body" onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}>
                <LogIn className="w-4 h-4 mr-1" /> {t("nav.login")}
              </Button>
            )}
          </motion.div>
        )}
      </nav>

      <HeroSection onHowItWorks={() => setHowItWorksOpen(true)} />
      <FeatureGrid />
      <ComparisonTable />
      <USPSection />
      <EcoSection />

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
              {t("templates.title")}
            </h2>
            <p className="font-body text-muted-foreground text-lg max-w-md mx-auto">
              {t("templates.subtitle")}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates
                    .filter((tpl) => tpl.eventType === type.value)
                    .map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={handleSelect}
                        onDemo={handleDemo}
                        demoOnly
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => navigate("/templates")}
              className="group inline-flex items-center gap-3 font-display text-sm md:text-base tracking-wide px-10 py-4 rounded-full bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:brightness-110 active:scale-[0.97]"
            >
              <span>{t("index.discoverAll")}</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </div>
      </section>

      <DemoPreview template={demoTemplate} open={demoOpen} onOpenChange={setDemoOpen} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <HowItWorksDialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen} />
      <Footer />
    </div>
  );
};

export default Index;
