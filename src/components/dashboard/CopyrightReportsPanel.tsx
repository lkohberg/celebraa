import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Trash2, Shield, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

const useCopyrightReports = () =>
  useQuery({
    queryKey: ["copyright-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("copyright_reports" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 30000,
  });

const CopyrightReportsPanel = () => {
  const { data: reports, isLoading } = useCopyrightReports();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleDisableMusic = async (report: any) => {
    setProcessing(report.id);
    try {
      // Get the event's current block_config
      const { data: eventData, error: fetchErr } = await supabase
        .from("events")
        .select("block_config")
        .eq("id", report.event_id)
        .single();
      if (fetchErr) throw fetchErr;

      const config = (eventData as any)?.block_config || {};
      const newConfig = { ...config, music_disabled: true };
      
      const { error: updateErr } = await supabase
        .from("events")
        .update({ block_config: newConfig } as any)
        .eq("id", report.event_id);
      if (updateErr) throw updateErr;

      // Mark report as reviewed
      await supabase
        .from("copyright_reports" as any)
        .update({ status: "music_disabled", resolved_at: new Date().toISOString() })
        .eq("id", report.id);

      toast.success("Musik wurde deaktiviert.");
      queryClient.invalidateQueries({ queryKey: ["copyright-reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error("Fehler beim Deaktivieren.");
    }
    setProcessing(null);
  };

  const handleDeleteMusic = async (report: any) => {
    if (!confirm("Musik endgültig löschen und Meldung als bestätigt markieren?")) return;
    setProcessing(report.id);
    try {
      const { data: eventData, error: fetchErr } = await supabase
        .from("events")
        .select("block_config")
        .eq("id", report.event_id)
        .single();
      if (fetchErr) throw fetchErr;

      const config = (eventData as any)?.block_config || {};
      const newConfig = { ...config, music_disabled: true, music_url: null, music_filename: null };

      const { error: updateErr } = await supabase
        .from("events")
        .update({ block_config: newConfig } as any)
        .eq("id", report.event_id);
      if (updateErr) throw updateErr;

      await supabase
        .from("copyright_reports" as any)
        .update({ status: "confirmed_deleted", resolved_at: new Date().toISOString() })
        .eq("id", report.id);

      toast.success("Musik gelöscht und Meldung bestätigt.");
      queryClient.invalidateQueries({ queryKey: ["copyright-reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error("Fehler beim Löschen.");
    }
    setProcessing(null);
  };

  const handleDismiss = async (report: any) => {
    setProcessing(report.id);
    try {
      // Re-enable music
      const { data: eventData } = await supabase
        .from("events")
        .select("block_config")
        .eq("id", report.event_id)
        .single();

      if (eventData) {
        const config = (eventData as any)?.block_config || {};
        const newConfig = { ...config, music_disabled: false };
        await supabase
          .from("events")
          .update({ block_config: newConfig } as any)
          .eq("id", report.event_id);
      }

      await supabase
        .from("copyright_reports" as any)
        .update({ status: "dismissed", resolved_at: new Date().toISOString() })
        .eq("id", report.id);

      toast.success("Meldung abgewiesen, Musik wieder aktiv.");
      queryClient.invalidateQueries({ queryKey: ["copyright-reports"] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error("Fehler.");
    }
    setProcessing(null);
  };

  if (isLoading) return <p className="font-body text-sm text-muted-foreground">Lade Meldungen...</p>;
  if (!reports || reports.length === 0) return null;

  const pendingReports = reports.filter((r: any) => r.status === "pending");
  const resolvedReports = reports.filter((r: any) => r.status !== "pending");

  return (
    <Card className="border-destructive/30">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-destructive" />
          Urheberrechtsmeldungen
          {pendingReports.length > 0 && (
            <Badge variant="destructive" className="text-[10px]">{pendingReports.length} offen</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingReports.map((report: any) => (
          <div key={report.id} className="border border-destructive/20 rounded-lg p-3 space-y-2 bg-destructive/5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-body text-xs text-muted-foreground">
                  Event: <span className="font-semibold text-foreground">{report.event_id.slice(0, 8)}...</span>
                </p>
                {report.reporter_email && (
                  <p className="font-body text-xs text-muted-foreground">Von: {report.reporter_email}</p>
                )}
                {report.reason && (
                  <p className="font-body text-sm text-foreground mt-1">{report.reason}</p>
                )}
                <p className="font-body text-[10px] text-muted-foreground mt-1">
                  {new Date(report.created_at).toLocaleString("de-AT")}
                </p>
              </div>
              <Badge variant="destructive" className="text-[10px] shrink-0">
                <AlertTriangle className="w-3 h-3 mr-1" /> Offen
              </Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="destructive" className="font-body text-xs" disabled={processing === report.id} onClick={() => handleDisableMusic(report)}>
                <VolumeX className="w-3 h-3 mr-1" /> Musik deaktivieren
              </Button>
              <Button size="sm" variant="destructive" className="font-body text-xs" disabled={processing === report.id} onClick={() => handleDeleteMusic(report)}>
                <Trash2 className="w-3 h-3 mr-1" /> Musik löschen
              </Button>
              <Button size="sm" variant="outline" className="font-body text-xs" disabled={processing === report.id} onClick={() => handleDismiss(report)}>
                <CheckCircle className="w-3 h-3 mr-1" /> Abweisen
              </Button>
            </div>
          </div>
        ))}

        {resolvedReports.length > 0 && (
          <details className="mt-2">
            <summary className="font-body text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              {resolvedReports.length} bearbeitete Meldung(en)
            </summary>
            <div className="space-y-2 mt-2">
              {resolvedReports.slice(0, 10).map((report: any) => (
                <div key={report.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/30 text-xs font-body">
                  <span className="text-muted-foreground">{report.event_id.slice(0, 8)}... – {report.status}</span>
                  <span className="text-muted-foreground">{new Date(report.created_at).toLocaleDateString("de-AT")}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default CopyrightReportsPanel;
