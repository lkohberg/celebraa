import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { templates } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, ArrowLeft, Upload, X, Globe, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { SUPPORTED_LANGUAGES, type EventLang } from "@/i18n/eventLabels";
import { useCreateEvent, useCheckEventLink } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";
import PriceSummary from "@/components/PriceSummary";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PremiumWeddingPage from "@/components/premium-templates/PremiumWeddingPage";
import PremiumBirthdayPage from "@/components/premium-templates/PremiumBirthdayPage";
import PremiumCorporatePage from "@/components/premium-templates/PremiumCorporatePage";
import { useTranslation } from "@/i18n";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "sonner";


const ConfigurePage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currency } = useCurrency();

  const fontOptions = [
    { value: "Playfair Display", label: t("font.playfair") },
    { value: "DM Sans", label: t("font.dmsans") },
    { value: "Georgia", label: t("font.georgia") },
  ];

  const template = templates.find((tp) => tp.id === templateId);
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const createEvent = useCreateEvent();
  const checkLink = useCheckEventLink();
  const [authOpen, setAuthOpen] = useState(false);
  const [linkAvailable, setLinkAvailable] = useState<boolean | null>(null);

  const isPremium = template?.tier === "premium";
  const basePrice = isPremium ? 99 : 49;

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    locationName: "",
    street: "",
    zip: "",
    city: "",
    description: "",
    rsvpEnabled: true,
    rsvpDeadline: "",
    maxGuests: "",
    menuSelection: false,
    primaryColor: template?.colors.primary || "#C8A951",
    font: template?.font || "Playfair Display",
    eventLink: "",
    // Premium fields
    storyText: "",
    ceremonyLocation: "",
    ceremonyStreet: "",
    ceremonyZip: "",
    ceremonyCity: "",
    receptionLocation: "",
    receptionStreet: "",
    receptionZip: "",
    receptionCity: "",
    heroImageUrl: template?.defaultHeroImage || "",
    languages: ["de"] as EventLang[],
    // New fields
    schedule: [] as { time: string; label: string }[],
    dressCode: "",
    childrenWelcome: "" as "" | "yes" | "no",
    hotels: [] as { name: string; address: string; url: string }[],
    showIntro: true,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleHeroFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateField("heroImageUrl", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleHeroFile(e.dataTransfer.files[0]);
  };

  // Reserved routes blocklist
  const RESERVED_ROUTES = ["templates", "configure", "success", "dashboard", "admin", "login", "signup", "settings", "api", "auth"];
  const isReservedLink = RESERVED_ROUTES.includes(form.eventLink.toLowerCase());

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "eventLink" && typeof value === "string") {
      const lower = value.toLowerCase();
      if (RESERVED_ROUTES.includes(lower)) {
        setLinkAvailable(null);
        return;
      }
      if (lower.length >= 3) {
        checkLink.mutate(lower, {
          onSuccess: (res) => setLinkAvailable(res.available),
        });
      }
    }
  };

  const linkValid = /^[a-z0-9-]*$/.test(form.eventLink);
  const isValid = form.title && form.date && form.time && form.eventLink && linkValid && linkAvailable !== false && !isReservedLink;

  const menuPrice = form.menuSelection ? 10 : 0;
  const extraLangs = isPremium ? Math.max(0, form.languages.length - 1) : 0;
  const langPrice = extraLangs * 3;
  const totalPrice = basePrice + menuPrice + langPrice;

  const handleSubmit = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!template) return;

    try {
      const combineAddr = (street: string, zip: string, city: string) => {
        const parts = [street, [zip, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
        return parts || null;
      };

      const eventInsert: any = {
        user_id: user.id,
        title: form.title,
        event_date: form.date,
        event_time: form.time,
        location_name: form.locationName || null,
        address: combineAddr(form.street, form.zip, form.city),
        description: form.description || null,
        template_id: template.id,
        primary_color: form.primaryColor,
        font: form.font,
        event_link: form.eventLink,
        rsvp_enabled: form.rsvpEnabled,
        rsvp_deadline: form.rsvpDeadline || null,
        max_guests: form.maxGuests ? parseInt(form.maxGuests) : null,
        menu_selection: form.menuSelection,
        price_paid: totalPrice * 100,
        status: "draft",
        tier: template.tier,
      };

      // Premium-specific fields
      if (isPremium) {
        eventInsert.story_text = form.storyText || null;
        eventInsert.ceremony_location = form.ceremonyLocation || null;
        eventInsert.ceremony_address = combineAddr(form.ceremonyStreet, form.ceremonyZip, form.ceremonyCity);
        eventInsert.reception_location = form.receptionLocation || null;
        eventInsert.reception_address = combineAddr(form.receptionStreet, form.receptionZip, form.receptionCity);
        eventInsert.hero_image_url = form.heroImageUrl || null;
      }

      // New fields
      eventInsert.schedule = isPremium && form.schedule.length > 0 ? form.schedule : null;
      eventInsert.dress_code = form.dressCode || null;
      eventInsert.children_welcome = form.childrenWelcome === "yes" ? true : form.childrenWelcome === "no" ? false : null;
      eventInsert.hotel_recommendations = isPremium && form.hotels.length > 0 ? form.hotels : null;

      // Languages (basis = only default language)
      eventInsert.languages = isPremium ? form.languages : [form.languages[0]];

      const { data: created, error: createError } = await supabase
        .from("events")
        .insert(eventInsert)
        .select()
        .single();

      if (createError) throw createError;

      // Admin bypass: skip payment for admin user
      if (isAdmin) {
        await supabase
          .from("events")
          .update({ status: "live", stripe_payment_id: "admin_bypass" })
          .eq("id", created.id);
        window.location.href = `${window.location.origin}/success/${form.eventLink}`;
        return;
      }

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke("create-checkout", {
        body: {
          eventId: created.id,
          successUrl: `${window.location.origin}/success/${form.eventLink}`,
          cancelUrl: window.location.href,
        },
      });

      if (checkoutError || !checkoutData?.url) {
        toast.error(t("order.paymentError"));
        return;
      }

      // Navigate to Stripe checkout
      try {
        if (window.top && window.top !== window.self) {
          window.top.location.href = checkoutData.url;
        } else {
          window.location.href = checkoutData.url;
        }
      } catch {
        // Same-origin policy blocks window.top access in iframe
        window.open(checkoutData.url, "_blank");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("order.createError");
      toast.error(message);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> {t("nav.back")}
            </Button>
            <span className="font-display text-lg font-bold text-foreground">
              celebra<span className="text-primary">.at</span>
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Live Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">{t("configure.preview")}</h3>
              {isPremium ? (
                <div className="rounded-xl overflow-hidden shadow-card max-h-[70vh] overflow-y-auto">
                  {(() => {
                    const previewEvent = {
                      id: "preview",
                      title: form.title || t("configure.yourTitle"),
                      event_date: form.date || "2026-06-20",
                      event_time: form.time || "18:00",
                      description: form.description || null,
                      location_name: form.locationName || null,
                      address: [form.street, [form.zip, form.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null,
                      story_text: form.storyText || null,
                      ceremony_location: form.ceremonyLocation || null,
                      ceremony_address: [form.ceremonyStreet, [form.ceremonyZip, form.ceremonyCity].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null,
                      reception_location: form.receptionLocation || null,
                      reception_address: [form.receptionStreet, [form.receptionZip, form.receptionCity].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null,
                      hero_image_url: form.heroImageUrl || template.defaultHeroImage || null,
                      rsvp_enabled: form.rsvpEnabled,
                      rsvp_deadline: form.rsvpDeadline || null,
                      menu_selection: form.menuSelection,
                      schedule: form.schedule.length > 0 ? form.schedule : null,
                      dress_code: form.dressCode || null,
                      children_welcome: form.childrenWelcome === "yes" ? true : form.childrenWelcome === "no" ? false : null,
                      hotel_recommendations: form.hotels.length > 0 ? form.hotels : null,
                    };
                    const previewTheme = {
                      primary: form.primaryColor || template.colors.primary,
                      secondary: template.colors.secondary,
                      accent: template.colors.accent,
                      font: form.font || template.font,
                    };
                    switch (template.eventType) {
                      case "wedding":
                        return <PremiumWeddingPage event={previewEvent} theme={previewTheme} showIntro={form.showIntro} />;
                      case "birthday":
                        return <PremiumBirthdayPage event={previewEvent} theme={previewTheme} showIntro={form.showIntro} />;
                      case "corporate":
                        return <PremiumCorporatePage event={previewEvent} theme={previewTheme} showIntro={form.showIntro} />;
                    }
                  })()}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden shadow-card" style={{ background: template.previewGradient, fontFamily: `'${form.font}', sans-serif` }}>
                  <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(form.font)}:wght@300;400;500;600;700&display=swap`} rel="stylesheet" />
                  <div className="p-8 text-center">
                    <p className="text-xs font-body uppercase tracking-widest mb-3 opacity-50" style={{ color: template.colors.accent }}>
                      {t("configure.invitation")}
                    </p>
                    <h2
                      className="text-2xl md:text-3xl font-bold mb-2"
                      style={{
                        fontFamily: form.font,
                        color: template.colors.primary === "#FFFFFF" ? template.colors.accent : template.colors.primary,
                      }}
                    >
                      {form.title || t("configure.yourTitle")}
                    </h2>
                    {form.description && (
                      <p className="font-body text-sm opacity-70 mt-2 max-w-xs mx-auto" style={{ color: template.colors.accent }}>
                        {form.description}
                      </p>
                    )}
                    <div className="mt-6 space-y-2 max-w-xs mx-auto text-left">
                      {form.date && (
                        <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                          <Calendar className="w-4 h-4" /><span>{form.date}</span>
                        </div>
                      )}
                      {form.time && (
                        <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                          <Clock className="w-4 h-4" /><span>{form.time} {t("configure.timeUnit")}</span>
                        </div>
                      )}
                      {form.locationName && (
                        <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                          <MapPin className="w-4 h-4" /><span>{form.locationName}</span>
                        </div>
                      )}
                      {form.maxGuests && (
                        <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                          <Users className="w-4 h-4" /><span>max. {form.maxGuests} {t("dashboard.guests")}</span>
                        </div>
                      )}
                      {form.dressCode && (
                        <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                          <span className="w-4 h-4 text-center">👔</span><span>{form.dressCode}</span>
                        </div>
                      )}
                    </div>
                    {form.rsvpEnabled && (
                      <div className="mt-8 bg-background/80 backdrop-blur rounded-lg p-5">
                        <p className="font-display text-base font-semibold text-foreground mb-2">{t("configure.rsvpQuestion")}</p>
                        <div className="flex gap-3 justify-center">
                          <Button size="sm" className="font-body">{t("configure.rsvpYes")}</Button>
                          <Button size="sm" variant="outline" className="font-body">{t("configure.rsvpNo")}</Button>
                        </div>
                        {form.menuSelection && (
                          <p className="text-xs font-body text-muted-foreground mt-3 opacity-70">
                            {t("configure.menuDietaryPreview")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Config Form */}
          <div className="order-1 lg:order-2">
            <h3 className="font-display text-xl font-semibold mb-6 text-foreground">{t("configure.title")}</h3>
            <div className="space-y-6">
              <div>
                <Label className="font-body">{t("configure.eventTitle")} *</Label>
                <Input placeholder={t("configure.eventTitlePlaceholder")} value={form.title} onChange={(e) => updateField("title", e.target.value)} className="font-body mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">{t("configure.date")} *</Label>
                  <Input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} className="font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body">{t("configure.time")} *</Label>
                  <Input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} className="font-body mt-1 w-full min-w-0" />
                </div>
              </div>

              <div>
                <Label className="font-body">{t("configure.location")}</Label>
                <Input placeholder={t("configure.locationPlaceholder")} value={form.locationName} onChange={(e) => updateField("locationName", e.target.value)} className="font-body mt-1" />
              </div>

              <div>
                <Label className="font-body">{t("configure.address")}</Label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  <Input placeholder={t("configure.streetPlaceholder")} value={form.street} onChange={(e) => updateField("street", e.target.value)} className="font-body" />
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder={t("configure.zipPlaceholder")} value={form.zip} onChange={(e) => updateField("zip", e.target.value)} className="font-body" />
                    <Input placeholder={t("configure.cityPlaceholder")} value={form.city} onChange={(e) => updateField("city", e.target.value)} className="font-body col-span-2" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-body">{t("configure.description")}</Label>
                <Textarea placeholder={t("configure.descriptionPlaceholder")} value={form.description} onChange={(e) => updateField("description", e.target.value)} className="font-body mt-1" rows={3} />
              </div>

              {/* Premium-specific fields */}
              {isPremium && (
                <div className="border border-primary/30 rounded-lg p-5 space-y-4 bg-primary/5">
                   <h4 className="font-display text-base font-semibold text-foreground">{t("configure.premiumDetails")}</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-body text-sm">{t("configure.introAnimation")}</Label>
                      <p className="text-xs text-muted-foreground font-body">{t("configure.introAnimationDesc")}</p>
                    </div>
                    <Switch checked={form.showIntro} onCheckedChange={(v) => updateField("showIntro", v)} />
                  </div>

                  <div>
                    <Label className="font-body text-sm">{t("configure.storyText")}</Label>
                    <Textarea placeholder={t("configure.storyPlaceholder")} value={form.storyText} onChange={(e) => updateField("storyText", e.target.value)} className="font-body mt-1" rows={4} />
                  </div>

                  {template.eventType === "wedding" && (
                    <>
                      <div>
                        <Label className="font-body text-sm">{t("configure.ceremonyLocation")}</Label>
                        <Input value={form.ceremonyLocation} onChange={(e) => updateField("ceremonyLocation", e.target.value)} className="font-body mt-1" />
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("configure.ceremonyAddress")}</Label>
                        <div className="grid grid-cols-1 gap-2 mt-1">
                          <Input placeholder={t("configure.streetPlaceholder")} value={form.ceremonyStreet} onChange={(e) => updateField("ceremonyStreet", e.target.value)} className="font-body" />
                          <div className="grid grid-cols-3 gap-2">
                            <Input placeholder={t("configure.zipPlaceholder")} value={form.ceremonyZip} onChange={(e) => updateField("ceremonyZip", e.target.value)} className="font-body" />
                            <Input placeholder={t("configure.cityPlaceholder")} value={form.ceremonyCity} onChange={(e) => updateField("ceremonyCity", e.target.value)} className="font-body col-span-2" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("configure.receptionLocation")}</Label>
                        <Input value={form.receptionLocation} onChange={(e) => updateField("receptionLocation", e.target.value)} className="font-body mt-1" />
                      </div>
                      <div>
                        <Label className="font-body text-sm">{t("configure.receptionAddress")}</Label>
                        <div className="grid grid-cols-1 gap-2 mt-1">
                          <Input placeholder={t("configure.streetPlaceholder")} value={form.receptionStreet} onChange={(e) => updateField("receptionStreet", e.target.value)} className="font-body" />
                          <div className="grid grid-cols-3 gap-2">
                            <Input placeholder={t("configure.zipPlaceholder")} value={form.receptionZip} onChange={(e) => updateField("receptionZip", e.target.value)} className="font-body" />
                            <Input placeholder={t("configure.cityPlaceholder")} value={form.receptionCity} onChange={(e) => updateField("receptionCity", e.target.value)} className="font-body col-span-2" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label className="font-body text-sm">{t("configure.heroImage")}</Label>
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
                            onClick={(e) => { e.stopPropagation(); updateField("heroImageUrl", ""); }}
                          >
                            <X className="w-4 h-4 text-foreground" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-background/70 backdrop-blur text-center py-1">
                            <p className="text-xs font-body text-muted-foreground">{t("configure.clickOrDragReplace")}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-body text-muted-foreground text-center">
                            {t("configure.dragOrClickUpload")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Editor (Premium only) */}
              {isPremium && (
              <div className="border border-border rounded-lg p-5 space-y-4">
                <Label className="font-body font-semibold">{t("configure.schedule")}</Label>
                <p className="font-body text-xs text-muted-foreground">{t("configure.scheduleHint")}</p>
                {form.schedule.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={item.time}
                      onChange={(e) => {
                        const updated = [...form.schedule];
                        updated[i] = { ...updated[i], time: e.target.value };
                        setForm((prev) => ({ ...prev, schedule: updated }));
                      }}
                      className="font-body w-28"
                    />
                    <Input
                      placeholder={t("configure.scheduleLabelPlaceholder")}
                      value={item.label}
                      onChange={(e) => {
                        const updated = [...form.schedule];
                        updated[i] = { ...updated[i], label: e.target.value };
                        setForm((prev) => ({ ...prev, schedule: updated }));
                      }}
                      className="font-body flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setForm((prev) => ({ ...prev, schedule: prev.schedule.filter((_, idx) => idx !== i) }))}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-body"
                  onClick={() => setForm((prev) => ({ ...prev, schedule: [...prev.schedule, { time: "", label: "" }] }))}
                >
                  <Plus className="w-4 h-4 mr-1" /> {t("configure.addScheduleItem")}
                </Button>
              </div>
              )}

              {/* Dress Code */}
              <div>
                <Label className="font-body">{t("configure.dressCode")}</Label>
                <Select value={form.dressCode || "none"} onValueChange={(v) => setForm((prev) => ({ ...prev, dressCode: v === "none" ? "" : v }))}>
                  <SelectTrigger className="font-body mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="font-body">{t("configure.dressCodeNone")}</SelectItem>
                    <SelectItem value="Casual" className="font-body">Casual</SelectItem>
                    <SelectItem value="Smart Casual" className="font-body">Smart Casual</SelectItem>
                    <SelectItem value="Business Casual" className="font-body">Business Casual</SelectItem>
                    <SelectItem value="Cocktail" className="font-body">Cocktail</SelectItem>
                    <SelectItem value="Festlich / Formal" className="font-body">{t("configure.dressCodeFormal")}</SelectItem>
                    <SelectItem value="Black Tie" className="font-body">Black Tie</SelectItem>
                    <SelectItem value="White Tie" className="font-body">White Tie</SelectItem>
                    <SelectItem value="Motto / Themed" className="font-body">{t("configure.dressCodeThemed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Children Welcome (wedding only) */}
              {template?.eventType === "wedding" && (
                <div>
                  <Label className="font-body">{t("configure.childrenWelcome")}</Label>
                  <Select value={form.childrenWelcome || "none"} onValueChange={(v) => setForm((prev) => ({ ...prev, childrenWelcome: v === "none" ? "" : v as "yes" | "no" }))}>
                    <SelectTrigger className="font-body mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="font-body">{t("configure.childrenNone")}</SelectItem>
                      <SelectItem value="yes" className="font-body">{t("configure.childrenYes")}</SelectItem>
                      <SelectItem value="no" className="font-body">{t("configure.childrenNo")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Hotel Recommendations (Premium only) */}
              {isPremium && (
              <div className="border border-border rounded-lg p-5 space-y-4">
                <Label className="font-body font-semibold">{t("configure.hotels")}</Label>
                <p className="font-body text-xs text-muted-foreground">{t("configure.hotelsHint")}</p>
                {form.hotels.map((hotel, i) => (
                  <div key={i} className="space-y-2 border-b border-border pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={t("configure.hotelName")}
                        value={hotel.name}
                        onChange={(e) => {
                          const updated = [...form.hotels];
                          updated[i] = { ...updated[i], name: e.target.value };
                          setForm((prev) => ({ ...prev, hotels: updated }));
                        }}
                        className="font-body flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setForm((prev) => ({ ...prev, hotels: prev.hotels.filter((_, idx) => idx !== i) }))}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <Input
                      placeholder={t("configure.hotelAddress")}
                      value={hotel.address}
                      onChange={(e) => {
                        const updated = [...form.hotels];
                        updated[i] = { ...updated[i], address: e.target.value };
                        setForm((prev) => ({ ...prev, hotels: updated }));
                      }}
                      className="font-body"
                    />
                    <Input
                      placeholder={t("configure.hotelUrl")}
                      value={hotel.url}
                      onChange={(e) => {
                        const updated = [...form.hotels];
                        updated[i] = { ...updated[i], url: e.target.value };
                        setForm((prev) => ({ ...prev, hotels: updated }));
                      }}
                      className="font-body"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="font-body"
                  onClick={() => setForm((prev) => ({ ...prev, hotels: [...prev.hotels, { name: "", address: "", url: "" }] }))}
                >
                  <Plus className="w-4 h-4 mr-1" /> {t("configure.addHotel")}
                </Button>
              </div>
              )}

              <div className="border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-body">{t("configure.rsvp")}</Label>
                  <Switch checked={form.rsvpEnabled} onCheckedChange={(v) => updateField("rsvpEnabled", v)} />
                </div>
                {form.rsvpEnabled && (
                  <>
                    <div>
                      <Label className="font-body text-sm">{t("configure.rsvpDeadline")}</Label>
                      <Input type="date" value={form.rsvpDeadline} onChange={(e) => updateField("rsvpDeadline", e.target.value)} className="font-body mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">{t("configure.maxGuests")}</Label>
                      <Input type="number" placeholder={t("configure.maxGuestsPlaceholder")} value={form.maxGuests} onChange={(e) => updateField("maxGuests", e.target.value)} className="font-body mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="font-body text-sm">{t("configure.menuDietary")}</Label>
                        <Switch checked={form.menuSelection} onCheckedChange={(v) => updateField("menuSelection", v)} />
                      </div>
                      {form.menuSelection && (
                        <p className="font-body text-xs text-muted-foreground mt-1">{t("configure.menuDietaryHint")}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">{t("configure.color")}</Label>
                  <Input type="color" value={form.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} className="mt-1 h-12 cursor-pointer" />
                </div>
                <div>
                  <Label className="font-body">{t("configure.font")}</Label>
                  <Select value={form.font} onValueChange={(v) => updateField("font", v)}>
                    <SelectTrigger className="font-body mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) => (
                        <SelectItem key={f.value} value={f.value} className="font-body">{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Language Selection (Premium only) */}
              {isPremium && (
              <div className="border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <Label className="font-body font-semibold">{t("configure.languages")}</Label>
                </div>
                <p className="font-body text-xs text-muted-foreground">{t("configure.languagesHint")}</p>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = form.languages.includes(lang.code);
                    const isFirst = form.languages[0] === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        className={`px-3 py-1.5 rounded-full text-xs font-body border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border hover:border-primary/50 text-foreground"
                        } ${isFirst ? "ring-2 ring-primary/30" : ""}`}
                        onClick={() => {
                          if (isFirst) return;
                          if (isSelected) {
                            setForm((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang.code) }));
                          } else if (form.languages.length < 3) {
                            setForm((prev) => ({ ...prev, languages: [...prev.languages, lang.code] }));
                          }
                        }}
                      >
                        {lang.flag} {lang.label}
                      </button>
                    );
                  })}
                </div>
                {form.languages.length > 1 && form.eventLink && (
                  <div className="mt-3 space-y-1">
                    <p className="font-body text-xs text-muted-foreground font-semibold">{t("configure.languageLinks")}</p>
                    {form.languages.map((code) => (
                      <p key={code} className="font-body text-xs text-muted-foreground">
                        {SUPPORTED_LANGUAGES.find((l) => l.code === code)?.flag} celebra.at/{form.eventLink}/{code}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              )}

              <div>
                <Label className="font-body">{t("configure.link")} *</Label>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground font-body bg-secondary px-3 py-2 rounded-l-md border border-r-0 border-input">
                    celebra.at/
                  </span>
                  <Input
                    placeholder={t("configure.linkPlaceholder")}
                    value={form.eventLink}
                    onChange={(e) => updateField("eventLink", e.target.value.toLowerCase())}
                    className="font-body rounded-l-none"
                  />
                </div>
                {form.eventLink && !linkValid && (
                  <p className="text-xs text-destructive font-body mt-1">{t("configure.linkError")}</p>
                )}
                {form.eventLink && linkValid && isReservedLink && (
                  <p className="text-xs text-destructive font-body mt-1">{t("configure.linkReserved")}</p>
                )}
                {form.eventLink && linkValid && !isReservedLink && linkAvailable === false && (
                  <p className="text-xs text-destructive font-body mt-1">{t("configure.linkTaken")}</p>
                )}
                {form.eventLink && linkValid && !isReservedLink && linkAvailable === true && (
                  <p className="text-xs text-primary font-body mt-1">{t("configure.linkAvailable")}</p>
                )}
              </div>

              <PriceSummary
                templateName={template.name}
                basePrice={basePrice}
                menuSelection={form.menuSelection}
                menuPrice={menuPrice}
                extraLangs={extraLangs}
                langPrice={langPrice}
                totalPrice={totalPrice}
                isValid={!!isValid}
                loading={createEvent.isPending}
                onSubmit={handleSubmit}
                tier={template.tier}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default ConfigurePage;

