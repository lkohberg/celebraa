import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyEvents, useEventGuests, useEventAnalytics, useUpdateEvent } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowLeft, BarChart3, CreditCard, Eye, Users, ExternalLink, Download, Copy, Check, Globe, Archive, Radio } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/i18n/eventLabels";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const { data: events, isLoading } = useMyEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">{t("nav.home")}</span>
            </Button>
            <span className="font-display text-lg font-bold text-foreground">
              celebra<span className="text-primary">.at</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground font-body hidden sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="font-body">
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">{t("dashboard.title")}</h1>

        {!events?.length ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="font-body text-muted-foreground mb-4">{t("dashboard.noEvents")}</p>
              <Button onClick={() => navigate("/templates")} className="font-body">
                {t("dashboard.createFirst")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Events List */}
            <div className="space-y-4">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground">{t("dashboard.yourEvents")}</h2>
              {events.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all ${selectedEventId === event.id ? "ring-2 ring-primary" : "hover:shadow-card-hover"}`}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-foreground text-sm sm:text-base truncate mr-2">{event.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={event.status === "paid" || event.status === "live" ? "default" : "outline"} className={event.status === "draft" ? "border-amber-500 text-amber-600" : ""}>
                          {event.status === "draft" ? t("dashboard.status.unpaid") : t(`dashboard.status.${event.status}`)}
                        </Badge>
                      </div>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("de-AT")} · /{event.event_link}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedEvent ? (
                <EventDetail event={selectedEvent} />
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <p className="font-body text-muted-foreground">{t("dashboard.selectEvent")}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventDetail = ({ event }: { event: { id: string; title: string; event_link: string; status: string; price_paid: number | null; event_date: string; stripe_payment_id: string | null; languages?: string[] | null } }) => {
  const { t } = useTranslation();
  const { data: guests } = useEventGuests(event.id);
  const { data: analytics } = useEventAnalytics(event.id);
  const updateEvent = useUpdateEvent();

  const accepted = guests?.filter((g) => g.rsvp_status === "accepted").length || 0;
  const declined = guests?.filter((g) => g.rsvp_status === "declined").length || 0;
  const pageViews = analytics?.filter((a) => a.event_type === "page_view").length || 0;
  const qrScans = analytics?.filter((a) => a.event_type === "qr_scan").length || 0;

  return (
    <Tabs defaultValue="analytics">
      <TabsList className="mb-6 w-full sm:w-auto">
        <TabsTrigger value="analytics" className="font-body text-xs sm:text-sm">
          <BarChart3 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("dashboard.analytics")}</span>
        </TabsTrigger>
        <TabsTrigger value="guests" className="font-body text-xs sm:text-sm">
          <Users className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("dashboard.guests")}</span>
        </TabsTrigger>
        <TabsTrigger value="payment" className="font-body text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("dashboard.payment")}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label={t("dashboard.pageViews")} value={pageViews} icon={Eye} />
          <StatCard label={t("dashboard.qrScans")} value={qrScans} icon={Eye} />
          <StatCard label={t("dashboard.accepted")} value={accepted} icon={Users} />
          <StatCard label={t("dashboard.declined")} value={declined} icon={Users} />
        </div>

        {/* Archive / Go Live toggle */}
        {(event.status === "live" || event.status === "archived") && (
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={event.status === "live" ? "outline" : "default"}
              size="sm"
              className="font-body"
              disabled={updateEvent.isPending}
              onClick={() => updateEvent.mutate({ id: event.id, status: event.status === "live" ? "archived" : "live" })}
            >
              {event.status === "live" ? (
                <><Archive className="w-4 h-4 mr-2" />{t("dashboard.archive")}</>
              ) : (
                <><Radio className="w-4 h-4 mr-2" />{t("dashboard.goLive")}</>
              )}
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
                const csvRows = guests.map(g => [
                  g.name,
                  g.email || "",
                  g.rsvp_status,
                  g.plus_one ? "Yes" : "No",
                  g.menu_choice || "",
                  (g.message || "").replace(/"/g, '""'),
                  g.responded_at ? new Date(g.responded_at).toLocaleDateString("de-AT") : "",
                ].map(v => `"${v}"`).join(","));
                const csv = [headers.join(","), ...csvRows].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `guests-${event.event_link}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="w-4 h-4 mr-2" /> {t("dashboard.exportCsv")}
              </Button>
            </div>
            <div className="space-y-3">
              {guests.map((guest) => (
                <Card key={guest.id}>
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-body font-medium text-foreground truncate">{guest.name}</p>
                      {guest.email && <p className="font-body text-sm text-muted-foreground truncate">{guest.email}</p>}
                      {guest.menu_choice && (
                        <Badge variant="outline" className="mt-1 text-xs">{t(`event.dietary.${guest.menu_choice}`) || guest.menu_choice}</Badge>
                      )}
                      {guest.message && <p className="font-body text-sm text-muted-foreground italic mt-1 truncate">"{guest.message}"</p>}
                    </div>
                    <Badge
                      className="ml-2 shrink-0"
                      variant={guest.rsvp_status === "accepted" ? "default" : guest.rsvp_status === "declined" ? "destructive" : "secondary"}
                    >
                      {t(`dashboard.rsvp.${guest.rsvp_status}`)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-3">
            <div className="flex justify-between font-body">
              <span className="text-muted-foreground">{t("dashboard.status")}</span>
              <Badge>{t(`dashboard.status.${event.status}`)}</Badge>
            </div>
            <div className="flex justify-between font-body">
              <span className="text-muted-foreground">{t("dashboard.paid")}</span>
              <span className="text-foreground font-semibold">
                {event.price_paid ? `€${(event.price_paid / 100).toFixed(2)}` : "–"}
              </span>
            </div>
            {event.stripe_payment_id && (
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Stripe ID</span>
                <span className="text-foreground text-sm font-mono truncate max-w-[200px]">{event.stripe_payment_id}</span>
              </div>
            )}
          </CardContent>
        </Card>
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
          const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
          const url = `${window.location.origin}/${event.event_link}/${code}`;
          return (
            <div key={code} className="flex items-center gap-2">
              <span className="text-xs">{lang?.flag}</span>
              <span className="font-body text-xs text-muted-foreground break-all flex-1">{url}</span>
              <button onClick={() => handleCopy(url, code)} className="text-muted-foreground hover:text-foreground">
                {copied === code ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) => (
  <Card>
    <CardContent className="p-3 sm:p-4 text-center">
      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
      <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{value}</p>
      <p className="font-body text-[10px] sm:text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
