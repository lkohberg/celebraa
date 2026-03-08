import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMyEvents, useEventGuests, useEventAnalytics, useUpdateEvent, useMusicWishes } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowLeft, BarChart3, CreditCard, Eye, Users, ExternalLink, Download, Copy, Check, Globe, Archive, Radio, AlertTriangle, Rocket, Music, Trash2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/i18n/eventLabels";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { blocks, isManualBlock } from "@/data/blocks";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
  const { data: events, isLoading } = useMyEvents();
  const { data: isAdmin } = useIsAdmin();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-muted-foreground mb-4">{t("admin.loginRequired")}</p>
          <Button onClick={() => navigate("/")} className="font-body">{t("admin.backHome")}</Button>
        </div>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">{t("dashboard.loading")}</p>
      </div>
    );
  }
  const pendingEvents = events?.filter(e => (e as any).status === "pending_review") || [];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">{t("nav.home")}</span>
            </Button>
            <span className="font-display text-lg font-bold text-foreground">celebra<span className="text-primary">.at</span></span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground font-body hidden sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="font-body">{t("nav.logout")}</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">{t("dashboard.title")}</h1>

        {isAdmin && pendingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> {t("admin.pendingReview")} ({pendingEvents.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEvents.map((event) => (<PendingEventCard key={event.id} event={event} />))}
            </div>
          </div>
        )}

        {!events?.length ? (
          <Card><CardContent className="py-16 text-center">
            <p className="font-body text-muted-foreground mb-4">{t("dashboard.noEvents")}</p>
            <Button onClick={() => navigate("/templates")} className="font-body">{t("dashboard.createFirst")}</Button>
          </CardContent></Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">{t("dashboard.yourEvents")}</h2>
              {events.map((event) => (
                <Card key={event.id} className={`cursor-pointer transition-all ${selectedEventId === event.id ? "ring-2 ring-primary" : "hover:shadow-card-hover"}`} onClick={() => setSelectedEventId(event.id)}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-foreground text-sm sm:text-base truncate mr-2">{event.title}</h3>
                      <Badge variant={event.status === "paid" || event.status === "live" ? "default" : event.status === "pending_review" ? "secondary" : "outline"} className={event.status === "draft" ? "border-amber-500 text-amber-600" : event.status === "pending_review" ? "bg-amber-100 text-amber-700" : ""}>
                        {event.status === "draft" ? t("dashboard.status.unpaid") : event.status === "pending_review" ? t("admin.inProgress") : t(`dashboard.status.${event.status}`)}
                      </Badge>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("de-AT")} · /{event.event_link}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-2">
              {selectedEvent ? (
                <EventDetail event={selectedEvent} isAdmin={isAdmin} onDeleted={() => setSelectedEventId(null)} />
              ) : (
                <Card><CardContent className="py-16 text-center">
                  <p className="font-body text-muted-foreground">{t("dashboard.selectEvent")}</p>
                </CardContent></Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PendingEventCard = ({ event }: { event: any }) => {
  const { t } = useTranslation();
  const [publishing, setPublishing] = useState(false);
  const selectedBlocks = (event.selected_blocks || []) as string[];
  const manualBlocksList = selectedBlocks.filter(id => isManualBlock(id));

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const { error } = await supabase.from("events").update({ status: "live" } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(`Event "${event.title}" ${t("admin.publishSuccess")}`);
      window.location.reload();
    } catch { toast.error(t("admin.publishError")); }
    setPublishing(false);
  };

  return (
    <Card className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground text-sm truncate mr-2">{event.title}</h3>
          <Badge className="bg-amber-100 text-amber-700 text-[10px]">{t("admin.pending")}</Badge>
        </div>
        <p className="font-body text-xs text-muted-foreground">{event.contact_first_name} {event.contact_last_name} · {event.contact_email}</p>
        <p className="font-body text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString("de-AT")} · /{event.event_link}</p>
        <div className="space-y-1">
          <p className="font-body text-xs font-semibold text-foreground">{t("admin.manualBlocks")}:</p>
          {manualBlocksList.map(id => {
            const block = blocks.find(b => b.id === id);
            return block ? (
              <div key={id} className="font-body text-xs text-muted-foreground flex items-center gap-1">
                <span>{block.icon}</span> {t(block.nameKey)}
                {block.requiresManualWork && <span className="text-amber-600">– {block.manualWorkDescriptionKey ? t(block.manualWorkDescriptionKey) : ""}</span>}
              </div>
            ) : null;
          })}
        </div>
        <Button className="w-full font-body font-semibold" size="sm" disabled={publishing} onClick={handlePublish}>
          <Rocket className="w-4 h-4 mr-2" /> {publishing ? t("admin.publishing") : t("admin.publishNow")}
        </Button>
      </CardContent>
    </Card>
  );
};

const EventDetail = ({ event, isAdmin, onDeleted }: { event: any; isAdmin?: boolean; onDeleted?: () => void }) => {
  const { t } = useTranslation();
  const { data: guests } = useEventGuests(event.id);
  const { data: analytics } = useEventAnalytics(event.id);
  const { data: musicWishes } = useMusicWishes(event.id);
  const updateEvent = useUpdateEvent();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t("dashboard.deleteConfirm"))) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) throw error;
      toast.success(t("dashboard.deleteSuccess"));
      onDeleted?.();
    } catch {
      toast.error(t("dashboard.deleteError"));
    }
    setDeleting(false);
  };

  const accepted = guests?.filter((g) => g.rsvp_status === "accepted").length || 0;
  const declined = guests?.filter((g) => g.rsvp_status === "declined").length || 0;
  const pageViews = analytics?.filter((a) => a.event_type === "page_view").length || 0;
  const qrScans = analytics?.filter((a) => a.event_type === "qr_scan").length || 0;

  const handlePublish = async () => {
    try {
      const { error } = await supabase.from("events").update({ status: "live" } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.eventLive"));
      window.location.reload();
    } catch { toast.error(t("admin.eventLiveError")); }
  };

  const exportMusicWishesCSV = () => {
    if (!musicWishes?.length) return;
    const headers = [t("admin.csvSong"), t("admin.csvArtist"), t("admin.csvGuest"), t("admin.csvDate")];
    const rows = musicWishes.map((w: any) => [
      w.song_title || "",
      w.artist || "",
      w.guest_name || "",
      w.created_at ? new Date(w.created_at).toLocaleDateString("de-AT") : "",
    ].map(v => `"${v}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `musikwuensche-${event.event_link}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const selectedBlocks = (event.selected_blocks || []) as string[];
  const hasMusicBlock = selectedBlocks.some((id: string) => id.endsWith("-musicpro") || id.endsWith("-musicwish"));

  return (
    <Tabs defaultValue="analytics">
      <TabsList className="mb-6 w-full sm:w-auto flex-wrap">
        <TabsTrigger value="analytics" className="font-body text-xs sm:text-sm">
          <BarChart3 className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("dashboard.analytics")}</span>
        </TabsTrigger>
        <TabsTrigger value="guests" className="font-body text-xs sm:text-sm">
          <Users className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("dashboard.guests")}</span>
        </TabsTrigger>
        {hasMusicBlock && (
          <TabsTrigger value="music" className="font-body text-xs sm:text-sm">
            <Music className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("admin.musicWishes")}</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="payment" className="font-body text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("dashboard.payment")}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label={t("dashboard.pageViews")} value={pageViews} icon={Eye} />
          <StatCard label={t("dashboard.qrScans")} value={qrScans} icon={Eye} />
          <StatCard label={t("dashboard.accepted")} value={accepted} icon={Users} />
          <StatCard label={t("dashboard.declined")} value={declined} icon={Users} />
        </div>

        {isAdmin && event.status === "pending_review" && (
          <div className="mb-4 p-4 border border-amber-300 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
            <p className="font-body text-sm text-amber-700 mb-3">{t("admin.pendingManual")}</p>
            <Button size="sm" className="font-body" onClick={handlePublish}>
              <Rocket className="w-4 h-4 mr-2" /> {t("admin.publishNow")}
            </Button>
          </div>
        )}

        {(event.status === "live" || event.status === "archived") && (
          <div className="flex items-center gap-3 mb-4">
            <Button variant={event.status === "live" ? "outline" : "default"} size="sm" className="font-body" disabled={updateEvent.isPending}
              onClick={() => updateEvent.mutate({ id: event.id, status: event.status === "live" ? "archived" : "live" })}>
              {event.status === "live" ? (<><Archive className="w-4 h-4 mr-2" />{t("dashboard.archive")}</>) : (<><Radio className="w-4 h-4 mr-2" />{t("dashboard.goLive")}</>)}
            </Button>
          </div>
        )}

        {event.status === "live" && (
          <div className="space-y-3">
            <LanguageLinks event={event} />
            <Button variant="outline" asChild className="font-body">
              <a href={`/${event.event_link}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" /> {t("dashboard.openEvent")}
              </a>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="guests">
        {!guests?.length ? (
          <p className="font-body text-muted-foreground">{t("dashboard.noGuests")}</p>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="font-body" onClick={() => {
                if (!guests) return;
                const headers = ["Name", "Email", "RSVP", "Plus One", "Menu Choice", "Message", "Date"];
                const csvRows = guests.map(g => [g.name, g.email || "", g.rsvp_status, g.plus_one ? "Yes" : "No", g.menu_choice || "", (g.message || "").replace(/"/g, '""'), g.responded_at ? new Date(g.responded_at).toLocaleDateString("de-AT") : ""].map(v => `"${v}"`).join(","));
                const csv = [headers.join(","), ...csvRows].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = `guests-${event.event_link}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="w-4 h-4 mr-2" /> {t("dashboard.exportCsv")}
              </Button>
            </div>
            <div className="space-y-3">
              {guests.map((guest) => (
                <Card key={guest.id}><CardContent className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-body font-medium text-foreground truncate">{guest.name}</p>
                    {guest.email && <p className="font-body text-sm text-muted-foreground truncate">{guest.email}</p>}
                    {guest.menu_choice && <Badge variant="outline" className="mt-1 text-xs">{guest.menu_choice}</Badge>}
                    {guest.message && <p className="font-body text-sm text-muted-foreground italic mt-1 truncate">"{guest.message}"</p>}
                  </div>
                  <Badge className="ml-2 shrink-0" variant={guest.rsvp_status === "accepted" ? "default" : guest.rsvp_status === "declined" ? "destructive" : "secondary"}>
                    {t(`dashboard.rsvp.${guest.rsvp_status}`)}
                  </Badge>
                </CardContent></Card>
              ))}
            </div>
          </>
        )}
      </TabsContent>

      {hasMusicBlock && (
        <TabsContent value="music">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">{t("admin.musicWishes")} ({musicWishes?.length || 0})</h3>
            {musicWishes && musicWishes.length > 0 && (
              <Button variant="outline" size="sm" className="font-body" onClick={exportMusicWishesCSV}>
                <Download className="w-4 h-4 mr-2" /> {t("admin.csvExport")}
              </Button>
            )}
          </div>
          {!musicWishes?.length ? (
            <p className="font-body text-muted-foreground">{t("admin.noMusicWishes")}</p>
          ) : (
            <div className="space-y-2">
              {musicWishes.map((wish: any) => (
                <Card key={wish.id}><CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body font-medium text-foreground">🎵 {wish.song_title}</p>
                      {wish.artist && <p className="font-body text-sm text-muted-foreground">{wish.artist}</p>}
                    </div>
                    <div className="text-right">
                      {wish.guest_name && <p className="font-body text-sm text-muted-foreground">{wish.guest_name}</p>}
                      <p className="font-body text-xs text-muted-foreground">{new Date(wish.created_at).toLocaleDateString("de-AT")}</p>
                    </div>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          )}
        </TabsContent>
      )}

      <TabsContent value="payment">
        <Card><CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex justify-between font-body"><span className="text-muted-foreground">{t("dashboard.status")}</span><Badge>{event.status === "pending_review" ? t("admin.inProgress") : t(`dashboard.status.${event.status}`)}</Badge></div>
          <div className="flex justify-between font-body"><span className="text-muted-foreground">{t("dashboard.paid")}</span><span className="text-foreground font-semibold">{event.price_paid ? `€${(event.price_paid / 100).toFixed(2)}` : "–"}</span></div>
          {event.stripe_payment_id && <div className="flex justify-between font-body"><span className="text-muted-foreground">Stripe ID</span><span className="text-foreground text-sm font-mono truncate max-w-[200px]">{event.stripe_payment_id}</span></div>}
          <div className="pt-4 border-t border-border">
            <Button variant="destructive" size="sm" className="font-body" disabled={deleting} onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> {deleting ? "..." : t("dashboard.deleteEvent")}
            </Button>
          </div>
        </CardContent></Card>
      </TabsContent>
    </Tabs>
  );
};

const LanguageLinks = ({ event }: { event: any }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const languages = event.languages as string[] | undefined;
  if (!languages || languages.length <= 1) return null;

  const handleCopy = async (url: string, code: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mb-4">
      <p className="font-body text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
        <Globe className="w-3 h-3" /> {t("dashboard.languageLinks")}
      </p>
      <div className="space-y-1">
        {languages.map((code) => {
          const langLabel = SUPPORTED_LANGUAGES.find((l) => l.code === code)?.label || code;
          const url = `${window.location.origin}/${event.event_link}/${code}`;
          return (
            <div key={code} className="flex items-center gap-2 font-body text-sm">
              <span className="text-muted-foreground">{langLabel}:</span>
              <code className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded truncate max-w-[200px]">{url}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleCopy(url, code)}>
                {copied === code ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
  <Card><CardContent className="p-3 sm:p-4 text-center">
    <Icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
    <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{value}</p>
    <p className="font-body text-[10px] sm:text-xs text-muted-foreground">{label}</p>
  </CardContent></Card>
);

export default AdminDashboard;
