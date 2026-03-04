import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyEvents, useEventGuests, useEventAnalytics } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, CreditCard, Eye, Users, ExternalLink } from "lucide-react";

const statusLabels: Record<string, string> = {
  draft: "Entwurf",
  paid: "Bezahlt",
  live: "Live",
  archived: "Archiviert",
};

const statusColors: Record<string, string> = {
  draft: "secondary",
  paid: "default",
  live: "default",
  archived: "secondary",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: events, isLoading } = useMyEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Lade Events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Startseite
            </Button>
            <span className="font-display text-lg font-bold text-foreground">
              celebra<span className="text-primary">.at</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-body">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="font-body">
              Abmelden
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Mein Dashboard</h1>

        {!events?.length ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="font-body text-muted-foreground mb-4">Du hast noch keine Events erstellt.</p>
              <Button onClick={() => navigate("/templates")} className="font-body">
                Erstes Event erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events List */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Deine Events</h2>
              {events.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all ${selectedEventId === event.id ? "ring-2 ring-primary" : "hover:shadow-card-hover"}`}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-foreground">{event.title}</h3>
                      <Badge variant={statusColors[event.status] as "default" | "secondary"}>
                        {statusLabels[event.status]}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("de-AT")} · {event.event_link}.celebra.at
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
                    <p className="font-body text-muted-foreground">Wähle ein Event aus der Liste</p>
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

const EventDetail = ({ event }: { event: { id: string; title: string; event_link: string; status: string; price_paid: number | null; event_date: string; stripe_payment_id: string | null } }) => {
  const { data: guests } = useEventGuests(event.id);
  const { data: analytics } = useEventAnalytics(event.id);

  const accepted = guests?.filter((g) => g.rsvp_status === "accepted").length || 0;
  const declined = guests?.filter((g) => g.rsvp_status === "declined").length || 0;
  const pending = guests?.filter((g) => g.rsvp_status === "pending").length || 0;
  const pageViews = analytics?.filter((a) => a.event_type === "page_view").length || 0;
  const qrScans = analytics?.filter((a) => a.event_type === "qr_scan").length || 0;

  return (
    <Tabs defaultValue="analytics">
      <TabsList className="mb-6">
        <TabsTrigger value="analytics" className="font-body">
          <BarChart3 className="w-4 h-4 mr-2" /> Analytics
        </TabsTrigger>
        <TabsTrigger value="guests" className="font-body">
          <Users className="w-4 h-4 mr-2" /> Gäste
        </TabsTrigger>
        <TabsTrigger value="payment" className="font-body">
          <CreditCard className="w-4 h-4 mr-2" /> Zahlung
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Seitenaufrufe" value={pageViews} icon={Eye} />
          <StatCard label="QR-Scans" value={qrScans} icon={Eye} />
          <StatCard label="Zusagen" value={accepted} icon={Users} />
          <StatCard label="Absagen" value={declined} icon={Users} />
        </div>
        {event.status === "live" && (
          <Button variant="outline" asChild className="font-body">
            <a href={`https://${event.event_link}.celebra.at`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" /> Event-Seite öffnen
            </a>
          </Button>
        )}
      </TabsContent>

      <TabsContent value="guests">
        {!guests?.length ? (
          <p className="font-body text-muted-foreground">Noch keine Gäste</p>
        ) : (
          <div className="space-y-3">
            {guests.map((guest) => (
              <Card key={guest.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-body font-medium text-foreground">{guest.name}</p>
                    {guest.email && <p className="font-body text-sm text-muted-foreground">{guest.email}</p>}
                    {guest.message && <p className="font-body text-sm text-muted-foreground italic mt-1">"{guest.message}"</p>}
                  </div>
                  <Badge variant={guest.rsvp_status === "accepted" ? "default" : guest.rsvp_status === "declined" ? "destructive" : "secondary"}>
                    {guest.rsvp_status === "accepted" ? "Zugesagt" : guest.rsvp_status === "declined" ? "Abgesagt" : "Offen"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="payment">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between font-body">
              <span className="text-muted-foreground">Status</span>
              <Badge>{statusLabels[event.status]}</Badge>
            </div>
            <div className="flex justify-between font-body">
              <span className="text-muted-foreground">Bezahlt</span>
              <span className="text-foreground font-semibold">
                {event.price_paid ? `€${(event.price_paid / 100).toFixed(2)}` : "–"}
              </span>
            </div>
            {event.stripe_payment_id && (
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Stripe ID</span>
                <span className="text-foreground text-sm font-mono">{event.stripe_payment_id}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default AdminDashboard;
