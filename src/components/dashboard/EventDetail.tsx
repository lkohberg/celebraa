import { useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useEventGuests, useEventAnalytics, useUpdateEvent, useMusicWishes, usePotluckClaims, useQuizResponses, useGameVotes } from "@/hooks/useEvents";
import { toast } from "sonner";
import { blocks } from "@/data/blocks";
import { BarChart3, CreditCard, Eye, Users, ExternalLink, Download, Archive, Radio, Rocket, Music, Trash2, Package, Pencil, ShoppingBasket, HelpCircle, Gamepad2, AlertTriangle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AdminFulfillmentPanel from "./AdminFulfillmentPanel";
import LanguageLinks from "./LanguageLinks";
import StatCard from "./StatCard";
import EventEditDialog from "./EventEditDialog";

const EventDetail = ({ event, isAdmin, onDeleted }: { event: any; isAdmin?: boolean; onDeleted?: () => void }) => {
  const { t } = useTranslation();
  const { data: guests } = useEventGuests(event.id);
  const { data: analytics } = useEventAnalytics(event.id);
  const { data: musicWishes } = useMusicWishes(event.id);
  const { data: potluckClaims } = usePotluckClaims(event.id);
  const { data: quizResponses } = useQuizResponses(event.id);
  const { data: gameVotes } = useGameVotes(event.id);
  const updateEvent = useUpdateEvent();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t("dashboard.deleteConfirm"))) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("events").delete().eq("id", event.id);
      if (error) throw error;
      toast.success(t("dashboard.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
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
    if (!confirm(t("admin.goLiveConfirm"))) return;
    try {
      const { error } = await supabase.from("events").update({ status: "live" } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.eventLive"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
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
  const hasPotluckBlock = selectedBlocks.some((id: string) => id.endsWith("-potluck"));
  const hasQuizBlock = selectedBlocks.some((id: string) => id.endsWith("-quiz"));
  const hasGamesBlock = selectedBlocks.some((id: string) => id.endsWith("-games"));
  const hasInteractiveBlocks = hasPotluckBlock || hasQuizBlock || hasGamesBlock;
  const canEdit = event.status === "live" || event.status === "paid" || event.status === "draft";

  // Quiz stats
  const blockCfg = (event.block_config || {}) as any;
  const quizQuestions = blockCfg.quiz || [];
  const quizStats = quizQuestions.map((q: any, qi: number) => {
    const responses = quizResponses?.filter((r: any) => r.question_index === qi) || [];
    const optionCounts = (q.options || []).map((_: string, oi: number) =>
      responses.filter((r: any) => r.selected_option === oi).length
    );
    return { question: q.question, options: q.options || [], correctIndex: q.correctIndex, optionCounts, total: responses.length };
  });

  // Game vote stats
  const gameNames = (blockCfg.games || []).map((g: any) => g.name);
  const gameVoteCounts: Record<string, number> = {};
  gameVotes?.forEach((v: any) => {
    gameVoteCounts[v.game_name] = (gameVoteCounts[v.game_name] || 0) + 1;
  });

  return (
    <>
      <Tabs defaultValue={isAdmin ? "fulfillment" : "analytics"}>
        <TabsList className="mb-6 w-full sm:w-auto flex-wrap">
          {isAdmin && (
            <TabsTrigger value="fulfillment" className="font-body text-xs sm:text-sm">
              <Package className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("admin.fulfillmentTab")}</span>
            </TabsTrigger>
          )}
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
          {hasInteractiveBlocks && (
            <TabsTrigger value="interactive" className="font-body text-xs sm:text-sm">
              <Gamepad2 className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Ergebnisse</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="payment" className="font-body text-xs sm:text-sm">
            <CreditCard className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">{t("dashboard.payment")}</span>
          </TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="fulfillment">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  {event.status === "pending_review" && <Badge className="bg-amber-500 text-white">{t("admin.orderTag")}</Badge>}
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminFulfillmentPanel event={event} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

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

          {canEdit && (
            <div className="flex items-center gap-3 mb-4">
              <Button variant="outline" size="sm" className="font-body" onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" /> {t("dashboard.editEvent") || "Event bearbeiten"}
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
              {/* Single-language QR code */}
              {(!event.languages || (event.languages as string[]).length <= 1) && (
                <SingleQrCode eventLink={event.event_link} />
              )}
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
                  const headers = ["Name", "Email", "RSVP", "Plus One", "Companions", "Companion Names", "Menu Choice", "Message", "Date"];
                  const csvRows = guests.map(g => [
                    g.name,
                    g.email || "",
                    g.rsvp_status,
                    g.plus_one ? "Yes" : "No",
                    String(g.companion_count ?? 0),
                    (g.companion_names as string[] || []).join("; "),
                    g.menu_choice || "",
                    (g.message || "").replace(/"/g, '""'),
                    g.responded_at ? new Date(g.responded_at).toLocaleDateString("de-AT") : "",
                  ].map(v => `"${v}"`).join(","));
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
                      {(guest.companion_count ?? 0) > 0 && (
                        <p className="font-body text-xs text-muted-foreground mt-1">
                          +{guest.companion_count} Begleitperson{(guest.companion_count ?? 0) > 1 ? "en" : ""}
                          {guest.companion_names && (guest.companion_names as string[]).length > 0 && `: ${(guest.companion_names as string[]).join(", ")}`}
                        </p>
                      )}
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

        {hasInteractiveBlocks && (
          <TabsContent value="interactive">
            <div className="space-y-8">
              {/* Potluck Claims */}
              {hasPotluckBlock && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                    <ShoppingBasket className="w-5 h-5" /> Mitbringliste ({potluckClaims?.length || 0})
                  </h3>
                  {!potluckClaims?.length ? (
                    <p className="font-body text-sm text-muted-foreground">Noch keine Einträge.</p>
                  ) : (
                    <div className="space-y-2">
                      {potluckClaims.map((claim: any) => (
                        <Card key={claim.id}><CardContent className="p-3 sm:p-4 flex items-center justify-between">
                          <div>
                            <p className="font-body font-medium text-foreground">🧺 {claim.item_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-body text-sm text-foreground font-medium">{claim.claimed_by}</p>
                            <p className="font-body text-xs text-muted-foreground">{new Date(claim.created_at).toLocaleDateString("de-AT")}</p>
                          </div>
                        </CardContent></Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quiz Results */}
              {hasQuizBlock && quizQuestions.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5" /> Quiz-Ergebnisse ({quizResponses?.length || 0} Antworten)
                  </h3>
                  {quizStats.map((stat: any, qi: number) => (
                    <Card key={qi} className="mb-3"><CardContent className="p-4">
                      <p className="font-body font-medium text-foreground mb-3">Frage {qi + 1}: {stat.question}</p>
                      <div className="space-y-2">
                        {stat.options.map((opt: string, oi: number) => {
                          const count = stat.optionCounts[oi] || 0;
                          const pct = stat.total > 0 ? Math.round((count / stat.total) * 100) : 0;
                          const isCorrect = oi === stat.correctIndex;
                          return (
                            <div key={oi} className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-body text-sm ${isCorrect ? "font-semibold text-green-700" : "text-foreground"}`}>
                                    {isCorrect ? "✓ " : ""}{opt}
                                  </span>
                                  <span className="font-body text-xs text-muted-foreground">{count} ({pct}%)</span>
                                </div>
                                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                  <div className={`h-full rounded-full ${isCorrect ? "bg-green-500" : "bg-primary/50"}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent></Card>
                  ))}
                </div>
              )}

              {/* Game Votes */}
              {hasGamesBlock && gameNames.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                    <Gamepad2 className="w-5 h-5" /> Spiele-Abstimmung ({gameVotes?.length || 0} Stimmen)
                  </h3>
                  <div className="space-y-2">
                    {gameNames
                      .map((name: string) => ({ name, votes: gameVoteCounts[name] || 0 }))
                      .sort((a: any, b: any) => b.votes - a.votes)
                      .map((game: any) => {
                        const maxV = Math.max(...gameNames.map((n: string) => gameVoteCounts[n] || 0), 1);
                        const pct = Math.round((game.votes / maxV) * 100);
                        return (
                          <Card key={game.name}><CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-body font-medium text-foreground">🎮 {game.name}</span>
                              <span className="font-body text-sm text-muted-foreground font-medium">{game.votes} Stimmen</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                          </CardContent></Card>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
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

      <EventEditDialog event={event} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
};

const SingleQrCode = ({ eventLink }: { eventLink: string }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const url = `${window.location.origin}/${eventLink}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `qr-${eventLink}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex items-center gap-3">
      <div ref={qrRef} className="inline-block bg-card p-2 rounded-lg">
        <QRCodeSVG value={url} size={80} bgColor="transparent" fgColor="hsl(220, 20%, 14%)" level="H" />
      </div>
      <Button variant="ghost" size="sm" className="h-7 font-body text-xs" onClick={handleDownload}>
        <Download className="w-3 h-3 mr-1" /> QR
      </Button>
    </div>
  );
};

export default EventDetail;
