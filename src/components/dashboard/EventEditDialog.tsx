import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventEditDialogProps {
  event: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Georgia", label: "Georgia" },
];

const EventEditDialog = ({ event, open, onOpenChange }: EventEditDialogProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: event.title || "",
    description: event.description || "",
    event_date: event.event_date || "",
    event_time: event.event_time || "",
    location_name: event.location_name || "",
    address: event.address || "",
    ceremony_location: event.ceremony_location || "",
    ceremony_address: event.ceremony_address || "",
    reception_location: event.reception_location || "",
    reception_address: event.reception_address || "",
    rsvp_deadline: event.rsvp_deadline || "",
    rsvp_enabled: event.rsvp_enabled ?? true,
    max_guests: event.max_guests?.toString() || "",
    primary_color: event.primary_color || "#C8A951",
    font: event.font || "Playfair Display",
    children_welcome: event.children_welcome as boolean | null,
    story_text: event.story_text || "",
    dress_code: event.dress_code || "",
    hero_image_url: event.hero_image_url || "",
  });

  // Reset form when event changes
  useEffect(() => {
    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date || "",
      event_time: event.event_time || "",
      location_name: event.location_name || "",
      address: event.address || "",
      ceremony_location: event.ceremony_location || "",
      ceremony_address: event.ceremony_address || "",
      reception_location: event.reception_location || "",
      reception_address: event.reception_address || "",
      rsvp_deadline: event.rsvp_deadline || "",
      rsvp_enabled: event.rsvp_enabled ?? true,
      max_guests: event.max_guests?.toString() || "",
      primary_color: event.primary_color || "#C8A951",
      font: event.font || "Playfair Display",
      children_welcome: event.children_welcome as boolean | null,
      story_text: event.story_text || "",
      dress_code: event.dress_code || "",
      hero_image_url: event.hero_image_url || "",
    });
  }, [event]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: form.title,
          description: form.description || null,
          event_date: form.event_date,
          event_time: form.event_time,
          location_name: form.location_name || null,
          address: form.address || null,
          ceremony_location: form.ceremony_location || null,
          ceremony_address: form.ceremony_address || null,
          reception_location: form.reception_location || null,
          reception_address: form.reception_address || null,
          rsvp_deadline: form.rsvp_deadline || null,
          rsvp_enabled: form.rsvp_enabled,
          max_guests: form.max_guests ? parseInt(form.max_guests) : null,
          primary_color: form.primary_color,
          font: form.font,
          children_welcome: form.children_welcome,
          story_text: form.story_text || null,
          dress_code: form.dress_code || null,
          hero_image_url: form.hero_image_url || null,
        } as any)
        .eq("id", event.id);
      if (error) throw error;
      toast.success(t("dashboard.editSuccess") || "Änderungen gespeichert!");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      onOpenChange(false);
    } catch {
      toast.error(t("dashboard.editError") || "Fehler beim Speichern");
    }
    setSaving(false);
  };

  const isWedding = event.template_id?.startsWith("wedding");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{t("dashboard.editEvent") || "Event bearbeiten"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="font-body">{t("order.eventTitle") || "Titel"}</Label>
            <Input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="font-body mt-1" />
          </div>
          <div>
            <Label className="font-body">{t("order.description") || "Beschreibung"}</Label>
            <Textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="font-body mt-1" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body">{t("order.date") || "Datum"}</Label>
              <Input type="date" value={form.event_date} onChange={(e) => setForm(prev => ({ ...prev, event_date: e.target.value }))} className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body">{t("order.time") || "Uhrzeit"}</Label>
              <Input type="time" value={form.event_time} onChange={(e) => setForm(prev => ({ ...prev, event_time: e.target.value }))} className="font-body mt-1" />
            </div>
          </div>
          <div>
            <Label className="font-body">{t("order.location") || "Location"}</Label>
            <Input value={form.location_name} onChange={(e) => setForm(prev => ({ ...prev, location_name: e.target.value }))} className="font-body mt-1" />
          </div>
          <div>
            <Label className="font-body">{t("order.address") || "Adresse"}</Label>
            <Input value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} className="font-body mt-1" />
          </div>

          {isWedding && (
            <>
              <div className="border-t border-border pt-4">
                <Label className="font-body text-sm font-semibold">{t("order.ceremonyVenue") || "Trauung"}</Label>
                <Input value={form.ceremony_location} onChange={(e) => setForm(prev => ({ ...prev, ceremony_location: e.target.value }))} className="font-body mt-1" placeholder={t("order.ceremonyVenue") || "Ort der Trauung"} />
                <Input value={form.ceremony_address} onChange={(e) => setForm(prev => ({ ...prev, ceremony_address: e.target.value }))} className="font-body mt-2" placeholder={t("order.address") || "Adresse"} />
              </div>
              <div>
                <Label className="font-body text-sm font-semibold">{t("order.receptionVenue") || "Empfang"}</Label>
                <Input value={form.reception_location} onChange={(e) => setForm(prev => ({ ...prev, reception_location: e.target.value }))} className="font-body mt-1" placeholder={t("order.receptionVenue") || "Ort des Empfangs"} />
                <Input value={form.reception_address} onChange={(e) => setForm(prev => ({ ...prev, reception_address: e.target.value }))} className="font-body mt-2" placeholder={t("order.address") || "Adresse"} />
              </div>
              <div className="border-t border-border pt-4">
                <Label className="font-body text-sm font-semibold">{t("order.childrenWelcome") || "Kinder"}</Label>
                <div className="flex gap-2 mt-2">
                  <Button type="button" size="sm" variant={form.children_welcome === true ? "default" : "outline"} className="font-body" onClick={() => setForm(prev => ({ ...prev, children_welcome: true }))}>
                    {t("order.childrenYes") || "Willkommen"}
                  </Button>
                  <Button type="button" size="sm" variant={form.children_welcome === false ? "default" : "outline"} className="font-body" onClick={() => setForm(prev => ({ ...prev, children_welcome: false }))}>
                    {t("order.childrenNo") || "Nur Erwachsene"}
                  </Button>
                  <Button type="button" size="sm" variant={form.children_welcome === null ? "default" : "outline"} className="font-body" onClick={() => setForm(prev => ({ ...prev, children_welcome: null }))}>
                    {t("order.childrenNotShown") || "Nicht anzeigen"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* RSVP */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <Label className="font-body">{t("order.rsvpEnable") || "RSVP aktiviert"}</Label>
              <Switch checked={form.rsvp_enabled} onCheckedChange={(v) => setForm(prev => ({ ...prev, rsvp_enabled: v }))} />
            </div>
            {form.rsvp_enabled && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="font-body text-sm">{t("order.rsvpDeadline") || "RSVP-Frist"}</Label>
                  <Input type="date" value={form.rsvp_deadline} onChange={(e) => setForm(prev => ({ ...prev, rsvp_deadline: e.target.value }))} className="font-body mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm">{t("order.maxGuests") || "Max. Gäste"}</Label>
                  <Input type="number" value={form.max_guests} onChange={(e) => setForm(prev => ({ ...prev, max_guests: e.target.value }))} className="font-body mt-1" />
                </div>
              </div>
            )}
          </div>

          {/* Story Text */}
          <div>
            <Label className="font-body">{t("blockConfig.story") || "Geschichte / Beschreibung"}</Label>
            <Textarea value={form.story_text} onChange={(e) => setForm(prev => ({ ...prev, story_text: e.target.value }))} className="font-body mt-1" rows={3} />
          </div>

          {/* Dress Code */}
          <div>
            <Label className="font-body">{t("blockConfig.dresscode") || "Dresscode"}</Label>
            <Input value={form.dress_code} onChange={(e) => setForm(prev => ({ ...prev, dress_code: e.target.value }))} className="font-body mt-1" />
          </div>

          {/* Style */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <Label className="font-body">{t("order.primaryColor") || "Primärfarbe"}</Label>
              <Input type="color" value={form.primary_color} onChange={(e) => setForm(prev => ({ ...prev, primary_color: e.target.value }))} className="mt-1 h-10 cursor-pointer" />
            </div>
            <div>
              <Label className="font-body">{t("order.font") || "Schriftart"}</Label>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">{t("dashboard.cancel") || "Abbrechen"}</Button>
          <Button onClick={handleSave} disabled={saving || !form.title || !form.event_date || !form.event_time} className="font-body">
            {saving ? "..." : (t("dashboard.saveChanges") || "Speichern")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
