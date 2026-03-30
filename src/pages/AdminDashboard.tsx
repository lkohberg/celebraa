import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMyEvents } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowLeft, AlertTriangle, Package, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { blocks, isManualBlock } from "@/data/blocks";
import EventDetail from "@/components/dashboard/EventDetail";
import CopyrightReportsPanel from "@/components/dashboard/CopyrightReportsPanel";
import ReviewForm from "@/components/dashboard/ReviewForm";
import AdminReviewsPanel from "@/components/dashboard/AdminReviewsPanel";
import SuggestionBox from "@/components/dashboard/SuggestionBox";
import { markDashboardVisited } from "@/hooks/useNotificationCount";

const useUserEmail = (userId: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: ["user-email", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_email", { _user_id: userId! });
      if (error) throw error;
      return data as string | null;
    },
    enabled: !!userId && enabled,
    staleTime: 1000 * 60 * 10,
  });

const UserEmailBadge = ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
  const { t } = useTranslation();
  const { data: email } = useUserEmail(userId, isAdmin);
  if (!isAdmin) return null;
  return (
    <p className="font-body text-[10px] text-muted-foreground/60 mt-1 truncate">
      {t("dashboard.createdBy")}: {email || userId}
    </p>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useTranslation();
  const { data: isAdminReady, isLoading: adminLoading } = useIsAdmin();
  const isAdmin = !!isAdminReady;
  const { data: events, isLoading: eventsLoading } = useMyEvents(user?.id, isAdmin);
  const isLoading = adminLoading || eventsLoading;
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Mark dashboard as visited to reset notification badge
  useEffect(() => {
    if (user) markDashboardVisited();
  }, [user]);

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

  const pendingEvents = events?.filter(e => e.status === "pending_review") || [];

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
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
          {isAdmin && <AdminReviewsPanel />}
        </div>
        {isAdmin && <CopyrightReportsPanel />}

        {isAdmin && pendingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> {t("admin.pendingReview")} ({pendingEvents.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEvents.map((event) => (
                <Card key={event.id} className="border-amber-300 bg-amber-50/50 dark:bg-amber-950/10 cursor-pointer hover:shadow-card-hover transition-all" onClick={() => setSelectedEventId(event.id)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-semibold text-foreground text-sm truncate mr-2">{event.title}</h3>
                      <Badge className="bg-amber-500 text-white text-[10px]">{t("admin.orderTag")}</Badge>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{event.contact_first_name} {event.contact_last_name} · {event.contact_email}</p>
                    <p className="font-body text-xs text-muted-foreground">{new Date(event.event_date).toLocaleDateString("de-AT")} · /{event.event_link}</p>
                    <div className="space-y-1">
                      <p className="font-body text-xs font-semibold text-foreground">{t("admin.manualBlocks")}:</p>
                      {((event.selected_blocks || []) as string[]).filter(id => isManualBlock(id)).map(id => {
                        const block = blocks.find(b => b.id === id);
                        return block ? (
                          <div key={id} className="font-body text-xs text-muted-foreground flex items-center gap-1">
                            <span>{block.icon}</span> {t(block.nameKey)}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                      <div className="flex items-center gap-1">
                        <Badge variant={event.status === "paid" || event.status === "live" ? "default" : event.status === "pending_review" ? "secondary" : "outline"} className={event.status === "draft" ? "border-amber-500 text-amber-600" : event.status === "pending_review" ? "bg-amber-100 text-amber-700" : ""}>
                          {event.status === "pending_review" ? t("admin.orderTag") : event.status === "draft" ? t("dashboard.status.unpaid") : t(`dashboard.status.${event.status}`)}
                        </Badge>
                      </div>
                    </div>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString("de-AT")} · /{event.event_link}
                    </p>
                    {isAdmin && <UserEmailBadge userId={event.user_id} isAdmin={true} />}
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
        {user && (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <ReviewForm userId={user.id} />
            <SuggestionBox userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
