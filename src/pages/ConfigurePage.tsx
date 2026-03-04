import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { templates } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCreateEvent, useCheckEventLink } from "@/hooks/useEvents";
import AuthDialog from "@/components/AuthDialog";
import PriceSummary from "@/components/PriceSummary";
import { toast } from "sonner";

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display (Elegant)" },
  { value: "DM Sans", label: "DM Sans (Modern)" },
  { value: "Georgia", label: "Georgia (Klassisch)" },
];

const ConfigurePage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = templates.find((t) => t.id === templateId);
  const { user } = useAuth();
  const createEvent = useCreateEvent();
  const checkLink = useCheckEventLink();
  const [authOpen, setAuthOpen] = useState(false);
  const [linkAvailable, setLinkAvailable] = useState<boolean | null>(null);

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
    menuSelection: false,
    primaryColor: template?.colors.primary || "#C8A951",
    font: template?.font || "Playfair Display",
    eventLink: "",
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "eventLink" && typeof value === "string" && value.length >= 3) {
      checkLink.mutate(value.toLowerCase(), {
        onSuccess: (res) => setLinkAvailable(res.available),
      });
    }
  };

  const linkValid = /^[a-z0-9-]*$/.test(form.eventLink);
  const isValid = form.title && form.date && form.time && form.eventLink && linkValid && linkAvailable !== false;

  const basePrice = 49;
  const menuPrice = form.menuSelection ? 10 : 0;
  const totalPrice = basePrice + menuPrice;

  const handleSubmit = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!template) return;

    try {
      await createEvent.mutateAsync({
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
        menu_selection: form.menuSelection,
        price_paid: totalPrice * 100,
        status: "draft",
      });
      // TODO: After Stripe integration, redirect to payment instead
      navigate(`/success/${form.eventLink}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Fehler beim Erstellen";
      toast.error(message);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Template nicht gefunden.</p>
          <Button onClick={() => navigate("/")}>Zurück zur Startseite</Button>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Live Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">Live-Vorschau</h3>
              <div className="rounded-xl overflow-hidden shadow-card" style={{ background: template.previewGradient }}>
                <div className="p-8 text-center">
                  <p className="text-xs font-body uppercase tracking-widest mb-3 opacity-50" style={{ color: template.colors.accent }}>
                    Einladung
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      fontFamily: form.font,
                      color: template.colors.primary === "#FFFFFF" ? template.colors.accent : template.colors.primary,
                    }}
                  >
                    {form.title || "Dein Event-Titel"}
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
                        <Clock className="w-4 h-4" /><span>{form.time} Uhr</span>
                      </div>
                    )}
                    {form.locationName && (
                      <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                        <MapPin className="w-4 h-4" /><span>{form.locationName}</span>
                      </div>
                    )}
                    {form.maxGuests && (
                      <div className="flex items-center gap-2 opacity-60 text-sm font-body" style={{ color: template.colors.accent }}>
                        <Users className="w-4 h-4" /><span>max. {form.maxGuests} Gäste</span>
                      </div>
                    )}
                  </div>
                  {form.rsvpEnabled && (
                    <div className="mt-8 bg-background/80 backdrop-blur rounded-lg p-5">
                      <p className="font-display text-base font-semibold text-foreground mb-2">Bist du dabei?</p>
                      <div className="flex gap-3 justify-center">
                        <Button size="sm" className="font-body">Ja, ich komme!</Button>
                        <Button size="sm" variant="outline" className="font-body">Leider nicht</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Config Form */}
          <div className="order-1 lg:order-2">
            <h3 className="font-display text-xl font-semibold mb-6 text-foreground">Event konfigurieren</h3>
            <div className="space-y-6">
              <div>
                <Label className="font-body">Event-Titel *</Label>
                <Input placeholder="z.B. Sarahs 30. Geburtstag" value={form.title} onChange={(e) => updateField("title", e.target.value)} className="font-body mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Datum *</Label>
                  <Input type="date" value={form.date} onChange={(e) => updateField("date", e.target.value)} className="font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body">Uhrzeit *</Label>
                  <Input type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} className="font-body mt-1" />
                </div>
              </div>

              <div>
                <Label className="font-body">Location Name</Label>
                <Input placeholder="z.B. Schloss Mirabell" value={form.locationName} onChange={(e) => updateField("locationName", e.target.value)} className="font-body mt-1" />
              </div>

              <div>
                <Label className="font-body">Adresse</Label>
                <Input placeholder="Straße, PLZ Ort" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="font-body mt-1" />
              </div>

              <div>
                <Label className="font-body">Beschreibung</Label>
                <Textarea placeholder="Erzähle deinen Gästen mehr über das Event..." value={form.description} onChange={(e) => updateField("description", e.target.value)} className="font-body mt-1" rows={3} />
              </div>

              <div className="border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-body">RSVP aktivieren</Label>
                  <Switch checked={form.rsvpEnabled} onCheckedChange={(v) => updateField("rsvpEnabled", v)} />
                </div>
                {form.rsvpEnabled && (
                  <>
                    <div>
                      <Label className="font-body text-sm">RSVP Frist</Label>
                      <Input type="date" value={form.rsvpDeadline} onChange={(e) => updateField("rsvpDeadline", e.target.value)} className="font-body mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Max. Gäste (optional)</Label>
                      <Input type="number" placeholder="z.B. 80" value={form.maxGuests} onChange={(e) => updateField("maxGuests", e.target.value)} className="font-body mt-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="font-body text-sm">Menüauswahl anbieten (+€10)</Label>
                      <Switch checked={form.menuSelection} onCheckedChange={(v) => updateField("menuSelection", v)} />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body">Hauptfarbe</Label>
                  <Input type="color" value={form.primaryColor} onChange={(e) => updateField("primaryColor", e.target.value)} className="mt-1 h-12 cursor-pointer" />
                </div>
                <div>
                  <Label className="font-body">Schriftart</Label>
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

              <div>
                <Label className="font-body">Event-Link *</Label>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground font-body bg-secondary px-3 py-2 rounded-l-md border border-r-0 border-input">
                    celebra.at/
                  </span>
                  <Input
                    placeholder="mein-event"
                    value={form.eventLink}
                    onChange={(e) => updateField("eventLink", e.target.value.toLowerCase())}
                    className="font-body rounded-l-none"
                  />
                </div>
                {form.eventLink && !linkValid && (
                  <p className="text-xs text-destructive font-body mt-1">Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt.</p>
                )}
                {form.eventLink && linkValid && linkAvailable === false && (
                  <p className="text-xs text-destructive font-body mt-1">Dieser Link ist bereits vergeben.</p>
                )}
                {form.eventLink && linkValid && linkAvailable === true && (
                  <p className="text-xs text-primary font-body mt-1">✓ Link verfügbar!</p>
                )}
              </div>

              <PriceSummary
                templateName={template.name}
                basePrice={basePrice}
                menuSelection={form.menuSelection}
                menuPrice={menuPrice}
                totalPrice={totalPrice}
                isValid={!!isValid}
                loading={createEvent.isPending}
                onSubmit={handleSubmit}
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
