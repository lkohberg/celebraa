import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { templates } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight, Upload, X, Check, Package, Sparkles, User, CreditCard, Eye, Crown, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useCheckEventLink } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PremiumWeddingPage from "@/components/premium-templates/PremiumWeddingPage";
import PremiumBirthdayPage from "@/components/premium-templates/PremiumBirthdayPage";
import PremiumCorporatePage from "@/components/premium-templates/PremiumCorporatePage";
import LegalDialogs from "@/components/LegalDialogs";
import BlockConfigurator from "@/components/BlockConfigurator";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  blocks, packages, getBlocksForCategory, getPackagesForCategory,
  calculatePrice, getAllSelectedBlockIds, BASE_PRICE, hasManualBlocks, getManualBlocks,
  type Block, type Package as PackageType
} from "@/data/blocks";

const RESERVED_ROUTES = ["templates", "configure", "success", "dashboard", "admin", "login", "signup", "settings", "api", "auth", "order"];



const OrderFlow = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fontOptions = [
    { value: "Playfair Display", label: t("font.playfair") },
    { value: "DM Sans", label: t("font.dmsans") },
    { value: "Georgia", label: t("font.georgia") },
  ];

  const template = templates.find((tpl) => tpl.id === templateId);
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const checkLink = useCheckEventLink();
  const [authOpen, setAuthOpen] = useState(false);
  const [linkAvailable, setLinkAvailable] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const STEPS = [
    { key: "blocks", icon: Package, label: t("order.step.blocks") },
    { key: "configure", icon: Calendar, label: t("order.step.configure") },
    { key: "preview", icon: Eye, label: t("order.step.preview") },
    { key: "contact", icon: User, label: t("order.step.contact") },
  ];

  // Event config
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    locationName: "",
    address: "",
    description: "",
    rsvpEnabled: true,
    rsvpDeadline: "",
    maxGuests: "",
    primaryColor: template?.colors.primary || "#C8A951",
    font: template?.font || "Playfair Display",
    eventLink: "",
    heroImageUrl: template?.defaultHeroImage || "",
    storyText: "",
    ceremonyLocation: "",
    ceremonyAddress: "",
    receptionLocation: "",
    receptionAddress: "",
  });

  // Block selection
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();

  // Manual block info
  const [manualInfo, setManualInfo] = useState<Record<string, string>>({});

  // Contact
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [blockConfig, setBlockConfig] = useState<any>({});
  const [dragActive, setDragActive] = useState(false);

  // Scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">{t("configure.notFound")}</p>
          <Button onClick={() => navigate("/")}>{t("configure.backHome")}</Button>
        </div>
      </div>
    );
  }

  const category = template.eventType;
  const categoryBlocks = getBlocksForCategory(category);
  const categoryPackages = getPackagesForCategory(category);

  const allSelectedBlocks = getAllSelectedBlockIds(selectedBlockIds, selectedPackageId);
  const totalPrice = calculatePrice(selectedBlockIds, selectedPackageId);
  const needsManualWork = hasManualBlocks(allSelectedBlocks);
  const manualBlocks = getManualBlocks(allSelectedBlocks);

  const linkValid = /^[a-z0-9-]*$/.test(form.eventLink);
  const isReservedLink = RESERVED_ROUTES.includes(form.eventLink.toLowerCase());
  const step2Valid = form.title && form.date && form.time && form.eventLink && linkValid && linkAvailable !== false && !isReservedLink && form.eventLink.length >= 3;
  const step4Valid = contact.firstName.trim() && contact.lastName.trim() && contact.email.trim() && /\S+@\S+\.\S+/.test(contact.email) && termsAccepted;

  const handleLinkChange = (value: string) => {
    const lower = value.toLowerCase();
    setForm(prev => ({ ...prev, eventLink: lower }));
    if (RESERVED_ROUTES.includes(lower)) {
      setLinkAvailable(null);
      return;
    }
    if (lower.length >= 3) {
      checkLink.mutate(lower, { onSuccess: (res) => setLinkAvailable(res.available) });
    } else {
      setLinkAvailable(null);
    }
  };

  const handleHeroFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setForm(prev => ({ ...prev, heroImageUrl: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleHeroFile(e.dataTransfer.files[0]);
  };

  const toggleBlock = (blockId: string) => {
    setSelectedBlockIds(prev =>
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    );
  };

  const selectPackage = (pkgId: string) => {
    if (selectedPackageId === pkgId) {
      setSelectedPackageId(undefined);
    } else {
      setSelectedPackageId(pkgId);
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg) {
        setSelectedBlockIds(prev => prev.filter(id => !pkg.blockIds.includes(id)));
      }
    }
  };

  const buildPreviewEvent = () => {
    const selected = allSelectedBlocks;
    const hasBlock = (suffix: string) => selected.some(id => id.endsWith(suffix));

    return {
      id: "preview",
      title: form.title || t("configure.yourTitle"),
      event_date: form.date || "2026-06-20",
      event_time: form.time || "18:00",
      description: form.description || null,
      location_name: form.locationName || null,
      address: form.address || null,
      story_text: hasBlock("-story") ? (blockConfig.story_text || t("preview.fallback.storyText")) : null,
      ceremony_location: form.ceremonyLocation || null,
      ceremony_address: form.ceremonyAddress || null,
      reception_location: form.receptionLocation || null,
      reception_address: form.receptionAddress || null,
      hero_image_url: form.heroImageUrl || template.defaultHeroImage || null,
      rsvp_enabled: form.rsvpEnabled,
      rsvp_deadline: form.rsvpDeadline || null,
      menu_selection: hasBlock("-menu"),
      schedule: hasBlock("-timeline") ? (blockConfig.schedule?.length > 0 ? blockConfig.schedule : [
        { time: "15:00", label: t("preview.fallback.reception") },
        { time: "16:00", label: t("preview.fallback.ceremony") },
        { time: "18:00", label: t("preview.fallback.dinner") },
        { time: "20:00", label: t("preview.fallback.party") },
      ]) : null,
      dress_code: hasBlock("-dresscode") ? (blockConfig.dresscode_male ? `${t("preview.fallback.dressMale")}: ${blockConfig.dresscode_male} | ${t("preview.fallback.dressFemale")}: ${blockConfig.dresscode_female}` : "Elegant / Semi-formal") : null,
      children_welcome: null,
      hotel_recommendations: hasBlock("-hotels") ? (blockConfig.hotels?.length > 0 ? blockConfig.hotels : [
        { name: t("preview.fallback.hotelName"), address: t("preview.fallback.hotelAddress"), url: "https://example.com" },
      ]) : null,
      selectedBlocks: selected,
      block_config: blockConfig,
    };
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    setLoading(true);
    try {
      const eventInsert: any = {
        user_id: user.id,
        title: form.title,
        event_date: form.date,
        event_time: form.time,
        location_name: form.locationName || null,
        address: form.address || null,
        description: form.description || null,
        template_id: template.id,
        primary_color: form.primaryColor,
        font: form.font,
        event_link: form.eventLink,
        rsvp_enabled: form.rsvpEnabled,
        rsvp_deadline: form.rsvpDeadline || null,
        max_guests: form.maxGuests ? parseInt(form.maxGuests) : null,
        menu_selection: allSelectedBlocks.some(id => id.endsWith("-menu")),
        price_paid: totalPrice * 100,
        status: "draft",
        tier: "premium",
        selected_blocks: allSelectedBlocks,
        contact_first_name: contact.firstName,
        contact_last_name: contact.lastName,
        contact_email: contact.email,
        hero_image_url: form.heroImageUrl || null,
        story_text: blockConfig.story_text || form.storyText || null,
        ceremony_location: form.ceremonyLocation || null,
        ceremony_address: form.ceremonyAddress || null,
        reception_location: form.receptionLocation || null,
        reception_address: form.receptionAddress || null,
        dress_code: allSelectedBlocks.some(id => id.endsWith("-dresscode")) ? (blockConfig.dresscode_male ? `${t("preview.fallback.dressMale")}: ${blockConfig.dresscode_male} | ${t("preview.fallback.dressFemale")}: ${blockConfig.dresscode_female}` : "Elegant") : null,
        schedule: blockConfig.schedule?.length > 0 ? blockConfig.schedule : null,
        hotel_recommendations: blockConfig.hotels?.length > 0 ? blockConfig.hotels : null,
        block_config: blockConfig,
        languages: ["de"],
      };

      const { data: created, error: createError } = await supabase
        .from("events")
        .insert(eventInsert)
        .select()
        .single();

      if (createError) throw createError;

      // Admin bypass
      const isAdmin = user.email === "admin@celebra.at";
      if (isAdmin) {
        const newStatus = needsManualWork ? "pending_review" : "live";
        await supabase
          .from("events")
          .update({ status: newStatus, stripe_payment_id: "admin_bypass" })
          .eq("id", created.id);
        
        if (needsManualWork) {
          navigate(`/success/${form.eventLink}?pending=true`);
        } else {
          window.location.href = `${window.location.origin}/success/${form.eventLink}`;
        }
        return;
      }

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke("create-checkout", {
        body: {
          eventId: created.id,
          successUrl: needsManualWork
            ? `${window.location.origin}/success/${form.eventLink}?pending=true`
            : `${window.location.origin}/success/${form.eventLink}`,
          cancelUrl: window.location.href,
        },
      });

      if (checkoutError || !checkoutData?.url) {
        toast.error(t("order.paymentError"));
        setLoading(false);
        return;
      }

      try {
        if (window.top && window.top !== window.self) {
          window.top.location.href = checkoutData.url;
        } else {
          window.location.href = checkoutData.url;
        }
      } catch {
        window.open(checkoutData.url, "_blank");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("order.createError");
      toast.error(message);
      setLoading(false);
    }
  };

  const previewTheme = {
    primary: form.primaryColor || template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    font: form.font || template.font,
  };

  const isPremiumBlock = (block: Block) => block.price > 12;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => step > 0 ? setStep(step - 1) : navigate("/templates")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> {step > 0 ? t("order.back") : t("nav.back")}
            </Button>
            <span className="font-display text-lg font-bold text-foreground">
              celebra<span className="text-primary">.at</span>
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Step Progress */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-2 md:gap-8">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => { if (i < step) setStep(i); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm transition-all ${
                  i === step
                    ? "bg-primary text-primary-foreground font-semibold"
                    : i < step
                      ? "text-primary cursor-pointer hover:bg-primary/10"
                      : "text-muted-foreground"
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Block Selection */}
          {step === 0 && (
            <motion.div key="step-blocks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("order.blocksTitle")}</h2>
              <p className="font-body text-muted-foreground mb-8">{t("order.blocksSubtitle")}</p>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Packages */}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> {t("order.packages")}
                      <span className="text-xs font-body font-normal text-muted-foreground ml-2">{t("order.packagesSave")}</span>
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {categoryPackages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        const pkgBlocks = pkg.blockIds.map(id => blocks.find(b => b.id === id)!).filter(Boolean);
                        const individualPrice = pkgBlocks.reduce((sum, b) => sum + b.price, 0);
                        const savings = individualPrice - pkg.price;
                        const isTopPkg = pkg.id.includes("premium") || pkg.id.includes("allin") || pkg.id.includes("pro");
                        return (
                          <button
                            key={pkg.id}
                            onClick={() => selectPackage(pkg.id)}
                            className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                            }`}
                          >
                            {isTopPkg && (
                              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-[10px] font-body font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <Crown className="w-3 h-3" /> {t("order.popular")}
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-display font-semibold text-foreground">{t(pkg.nameKey)}</h4>
                              <div className="text-right">
                                <span className="font-display text-lg font-bold text-primary">€{pkg.price}</span>
                                {savings > 0 && (
                                  <p className="text-[10px] font-body text-green-600">{t("order.save")} €{savings}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {pkgBlocks.map(b => (
                                <span key={b.id} className="text-[10px] font-body bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                                  {b.icon} {t(b.nameKey)}
                                </span>
                              ))}
                            </div>
                            {isSelected && (
                              <div className="mt-3 flex items-center gap-1 text-xs font-body text-primary">
                                <Check className="w-3 h-3" /> {t("order.selected")}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual Blocks */}
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-muted-foreground" /> {t("order.singleBlocks")}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground mb-4">{t("order.singleBlocksHint")}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {categoryBlocks.map((block) => {
                        const inPackage = selectedPackageId ? packages.find(p => p.id === selectedPackageId)?.blockIds.includes(block.id) : false;
                        const isSelected = selectedBlockIds.includes(block.id) || inPackage;
                        const premium = isPremiumBlock(block);
                        return (
                          <button
                            key={block.id}
                            onClick={() => !inPackage && toggleBlock(block.id)}
                            disabled={!!inPackage}
                            className={`relative text-left p-4 rounded-lg border transition-all ${
                              inPackage
                                ? "border-primary/30 bg-primary/5 opacity-60 cursor-not-allowed"
                                : isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-card hover:border-primary/30"
                            }`}
                          >
                            {premium && (
                              <div className="absolute -top-2 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-body font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5" /> PREMIUM
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{block.icon}</span>
                                <div>
                                  <p className="font-body text-sm font-medium text-foreground">{t(block.nameKey)}</p>
                                  <p className="font-body text-[11px] text-muted-foreground">{t(block.descriptionKey)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`font-body text-sm font-semibold ${premium ? "text-amber-600" : "text-primary"}`}>+€{block.price}</span>
                                {(isSelected || inPackage) && <Check className="w-4 h-4 text-primary" />}
                              </div>
                            </div>
                            {inPackage && (
                              <p className="font-body text-[10px] text-primary mt-1">{t("order.inPackage")}</p>
                            )}
                            {block.requiresManualWork && (
                              <p className="font-body text-[10px] text-amber-600 mt-1">✋ {t("order.manualCreated")}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manual block info collection */}
                  {manualBlocks.length > 0 && (
                    <div className="border border-amber-300 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 space-y-4">
                      <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                        ✋ {t("order.manualTitle")}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {t("order.manualHint")}
                      </p>
                      {manualBlocks.map(block => (
                        <div key={block.id}>
                          <Label className="font-body text-sm">{block.icon} {t(block.nameKey)}</Label>
                          <p className="font-body text-xs text-muted-foreground mb-1">{block.manualWorkDescriptionKey ? t(block.manualWorkDescriptionKey) : ""}</p>
                          <Textarea
                            placeholder={t("order.manualPlaceholder")}
                            value={manualInfo[block.id] || ""}
                            onChange={(e) => setManualInfo(prev => ({ ...prev, [block.id]: e.target.value }))}
                            className="font-body mt-1"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-36 bg-secondary rounded-xl p-6 space-y-3">
                    <h4 className="font-display text-lg font-semibold text-foreground">{t("order.priceOverview")}</h4>
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-muted-foreground">{t("order.basePage")}</span>
                      <span className="text-foreground">€{BASE_PRICE}</span>
                    </div>
                    {selectedPackageId && (() => {
                      const pkg = packages.find(p => p.id === selectedPackageId);
                      return pkg ? (
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">{t(pkg.nameKey)}</span>
                          <span className="text-foreground">€{pkg.price}</span>
                        </div>
                      ) : null;
                    })()}
                    {selectedBlockIds.filter(id => !packages.find(p => p.id === selectedPackageId)?.blockIds.includes(id)).map(id => {
                      const block = blocks.find(b => b.id === id);
                      return block ? (
                        <div key={id} className="flex justify-between font-body text-sm">
                           <span className="text-muted-foreground">{block.icon} {t(block.nameKey)}</span>
                          <span className="text-foreground">€{block.price}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
                      <span className="text-foreground">{t("order.total")}</span>
                      <span className="text-primary text-lg">€{totalPrice}</span>
                    </div>
                    {needsManualWork && (
                      <p className="text-[10px] font-body text-amber-600">
                        ✋ {t("order.manualNote")}
                      </p>
                    )}
                    <Button className="w-full font-body font-semibold mt-3" onClick={() => setStep(1)}>
                      {t("order.continueEvent")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Configure Event */}
          {step === 1 && (
            <motion.div key="step-configure" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("order.configureTitle")}</h2>
              <p className="font-body text-muted-foreground mb-8">{t("order.configureSubtitle")}</p>

              <div className="space-y-6">
                <div>
                  <Label className="font-body">{t("order.eventTitle")} *</Label>
                  <Input placeholder={t("configure.eventTitlePlaceholder")} value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="font-body mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body">{t("order.date")} *</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))} className="font-body mt-1" />
                  </div>
                  <div>
                    <Label className="font-body">{t("order.time")} *</Label>
                    <Input type="time" value={form.time} onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))} className="font-body mt-1 w-full min-w-0" />
                  </div>
                </div>
                <div>
                  <Label className="font-body">{t("order.location")}</Label>
                  <Input placeholder={t("configure.locationPlaceholder")} value={form.locationName} onChange={(e) => setForm(prev => ({ ...prev, locationName: e.target.value }))} className="font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body">{t("order.address")}</Label>
                  <Input placeholder={t("configure.addressPlaceholder")} value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} className="font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body">{t("order.description")}</Label>
                  <Textarea placeholder={t("order.descriptionPlaceholder")} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="font-body mt-1" rows={3} />
                </div>

                {category === "wedding" && (
                  <div className="border border-border rounded-lg p-5 space-y-4">
                    <h4 className="font-display text-base font-semibold text-foreground">{t("order.weddingDetails")}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-body text-sm">{t("order.ceremonyVenue")}</Label>
                        <Input value={form.ceremonyLocation} onChange={(e) => setForm(prev => ({ ...prev, ceremonyLocation: e.target.value }))} className="font-body mt-1" />
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("order.ceremonyAddress")}</Label>
                        <Input value={form.ceremonyAddress} onChange={(e) => setForm(prev => ({ ...prev, ceremonyAddress: e.target.value }))} className="font-body mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-body text-sm">{t("order.receptionVenue")}</Label>
                        <Input value={form.receptionLocation} onChange={(e) => setForm(prev => ({ ...prev, receptionLocation: e.target.value }))} className="font-body mt-1" />
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("order.receptionAddress")}</Label>
                        <Input value={form.receptionAddress} onChange={(e) => setForm(prev => ({ ...prev, receptionAddress: e.target.value }))} className="font-body mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero Image */}
                <div>
                  <Label className="font-body">{t("order.heroImage")}</Label>
                  <div
                    className={`mt-1 relative rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
                      dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleHeroFile(file);
                      };
                      input.click();
                    }}
                  >
                    {form.heroImageUrl ? (
                      <div className="relative">
                        <img src={form.heroImageUrl} alt="Hero" className="w-full h-32 object-cover rounded-md" />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1 hover:bg-background"
                          onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, heroImageUrl: "" })); }}
                        >
                          <X className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 px-4">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-body text-muted-foreground text-center">{t("order.dragOrClick")}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RSVP */}
                <div className="border border-border rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-body">{t("order.rsvpEnable")}</Label>
                    <Switch checked={form.rsvpEnabled} onCheckedChange={(v) => setForm(prev => ({ ...prev, rsvpEnabled: v }))} />
                  </div>
                  {form.rsvpEnabled && (
                    <>
                      <div>
                        <Label className="font-body text-sm">{t("order.rsvpDeadline")}</Label>
                        <Input type="date" value={form.rsvpDeadline} onChange={(e) => setForm(prev => ({ ...prev, rsvpDeadline: e.target.value }))} className="font-body mt-1" />
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("order.maxGuests")}</Label>
                        <Input type="number" placeholder={t("order.maxGuestsPlaceholder")} value={form.maxGuests} onChange={(e) => setForm(prev => ({ ...prev, maxGuests: e.target.value }))} className="font-body mt-1" />
                      </div>
                    </>
                  )}
                </div>

                {/* Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body">{t("order.primaryColor")}</Label>
                    <Input type="color" value={form.primaryColor} onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))} className="mt-1 h-12 cursor-pointer" />
                  </div>
                  <div>
                    <Label className="font-body">{t("order.font")}</Label>
                    <Select value={form.font} onValueChange={(v) => setForm(prev => ({ ...prev, font: v }))}>
                      <SelectTrigger className="font-body mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((f) => (
                          <SelectItem key={f.value} value={f.value} className="font-body">{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Event Link */}
                <div>
                  <Label className="font-body">{t("order.eventLink")} *</Label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-muted-foreground font-body bg-secondary px-3 py-2 rounded-l-md border border-r-0 border-input">celebra.at/</span>
                    <Input
                      placeholder={t("configure.linkPlaceholder")}
                      value={form.eventLink}
                      onChange={(e) => handleLinkChange(e.target.value)}
                      className="font-body rounded-l-none"
                    />
                  </div>
                  {form.eventLink && !linkValid && <p className="text-xs text-destructive font-body mt-1">{t("order.linkInvalid")}</p>}
                  {form.eventLink && linkValid && isReservedLink && <p className="text-xs text-destructive font-body mt-1">{t("order.linkReserved")}</p>}
                  {form.eventLink && linkValid && !isReservedLink && linkAvailable === false && <p className="text-xs text-destructive font-body mt-1">{t("order.linkTaken")}</p>}
                  {form.eventLink && linkValid && !isReservedLink && linkAvailable === true && <p className="text-xs text-primary font-body mt-1">{t("order.linkAvailable")}</p>}
                </div>

                {/* Block Configuration */}
                {allSelectedBlocks.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">{t("order.configureBlocks")}</h3>
                    <p className="font-body text-xs text-muted-foreground mb-4">{t("order.configureBlocksHint")}</p>
                    <BlockConfigurator
                      selectedBlocks={allSelectedBlocks}
                      blockConfig={blockConfig}
                      setBlockConfig={setBlockConfig}
                      category={category}
                    />
                  </div>
                )}

                <Button className="w-full font-body font-semibold text-base py-5" disabled={!step2Valid} onClick={() => setStep(2)}>
                  {t("order.continuePreview")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Preview */}
          {step === 2 && (
            <motion.div key="step-preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{t("order.previewTitle")}</h2>
                    <p className="font-body text-muted-foreground">{t("order.previewSubtitle")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-muted-foreground">{t("order.totalPrice")}</p>
                    <p className="font-display text-2xl font-bold text-primary">€{totalPrice}</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-xl p-4 space-y-2">
                      <h4 className="font-display text-sm font-semibold text-foreground mb-2">{t("order.selectedBlocks")}</h4>
                      <div className="flex justify-between font-body text-xs">
                        <span className="text-muted-foreground">{t("order.basePage")}</span>
                        <span>€{BASE_PRICE}</span>
                      </div>
                      {allSelectedBlocks.map(id => {
                        const block = blocks.find(b => b.id === id);
                        return block ? (
                          <div key={id} className="flex justify-between font-body text-xs">
                            <span className="text-muted-foreground">{block.icon} {t(block.nameKey)}</span>
                            <span>€{block.price}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t border-border pt-2 flex justify-between font-body text-sm font-semibold">
                        <span>{t("order.total")}</span>
                        <span className="text-primary">€{totalPrice}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 font-body font-semibold" onClick={() => setStep(3)}>
                      {t("order.continueContact")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="rounded-xl overflow-hidden shadow-card max-h-[75vh] overflow-y-auto">
                      {(() => {
                        const previewEvent = buildPreviewEvent();
                        switch (category) {
                          case "wedding":
                            return <PremiumWeddingPage event={previewEvent} theme={previewTheme} />;
                          case "birthday":
                            return <PremiumBirthdayPage event={previewEvent} theme={previewTheme} />;
                          case "corporate":
                            return <PremiumCorporatePage event={previewEvent} theme={previewTheme} />;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Contact Details */}
          {step === 3 && (
            <motion.div key="step-contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-lg mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("order.contactTitle")}</h2>
              <p className="font-body text-muted-foreground mb-8">{t("order.contactSubtitle")}</p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-body">{t("order.firstName")} *</Label>
                    <Input
                      placeholder="Max"
                      value={contact.firstName}
                      onChange={(e) => setContact(prev => ({ ...prev, firstName: e.target.value }))}
                      className="font-body mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-body">{t("order.lastName")} *</Label>
                    <Input
                      placeholder="Mustermann"
                      value={contact.lastName}
                      onChange={(e) => setContact(prev => ({ ...prev, lastName: e.target.value }))}
                      className="font-body mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-body">{t("order.emailAddress")} *</Label>
                  <Input
                    type="email"
                    placeholder={t("order.emailPlaceholder")}
                    value={contact.email}
                    onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                    className="font-body mt-1"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-secondary rounded-xl p-6 space-y-3">
                  <h4 className="font-display text-lg font-semibold text-foreground">{t("order.summary")}</h4>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">{t("order.template")}: {template.name}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">{t("order.basePage")}</span>
                    <span className="text-foreground">€{BASE_PRICE}</span>
                  </div>
                  {selectedPackageId && (() => {
                    const pkg = packages.find(p => p.id === selectedPackageId);
                    return pkg ? (
                      <div className="flex justify-between font-body text-sm">
                        <span className="text-muted-foreground">{t("order.package")}: {t(pkg.nameKey)}</span>
                        <span className="text-foreground">€{pkg.price}</span>
                      </div>
                    ) : null;
                  })()}
                  {selectedBlockIds.filter(id => !packages.find(p => p.id === selectedPackageId)?.blockIds.includes(id)).map(id => {
                    const block = blocks.find(b => b.id === id);
                    return block ? (
                      <div key={id} className="flex justify-between font-body text-sm">
                        <span className="text-muted-foreground">{block.icon} {t(block.nameKey)}</span>
                        <span className="text-foreground">€{block.price}</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t border-border pt-3 flex justify-between font-body font-semibold">
                    <span className="text-foreground">{t("order.total")}</span>
                    <span className="text-primary text-lg">€{totalPrice}</span>
                  </div>
                  {needsManualWork && (
                    <p className="text-xs font-body text-amber-600">
                      ✋ {t("order.manualWorkNote")}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground font-body leading-relaxed cursor-pointer">
                    <LegalDialogs
                      inline
                      renderTrigger={(openDialog) => (
                        <>
                          {t("order.acceptTerms")}{" "}
                          <button type="button" onClick={() => openDialog("terms")} className="underline hover:text-foreground transition-colors">{t("footer.terms")}</button>
                          {" "}{t("order.and")}{" "}
                          <button type="button" onClick={() => openDialog("privacy")} className="underline hover:text-foreground transition-colors">{t("footer.privacy")}</button>
                        </>
                      )}
                    />
                  </label>
                </div>

                <Button
                  className="w-full font-body font-semibold text-base py-5"
                  disabled={!step4Valid || loading}
                  onClick={handleSubmit}
                >
                  {loading ? t("order.processing") : `${t("order.payNow")} €${totalPrice}`}
                  {!loading && <CreditCard className="w-4 h-4 ml-2" />}
                </Button>
                <p className="text-xs text-muted-foreground text-center font-body">
                  {t("order.stripeNote")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default OrderFlow;
