import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { blocks, isManualBlock } from "@/data/blocks";
import { Upload, Music, FileText, X, Eye, Rocket } from "lucide-react";

const AdminFulfillmentPanel = ({ event }: { event: any }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const illustrationInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const genericInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const selectedBlocks = (event.selected_blocks || []) as string[];
  const manualBlocksList = selectedBlocks.filter(id => isManualBlock(id));
  const blockConfig = (event.block_config || {}) as Record<string, any>;
  const manualInfo = (blockConfig._manual_info || {}) as Record<string, string>;
  const uploadedFiles = (blockConfig._admin_files || []) as { name: string; url: string; blockId?: string; uploadedAt: string }[];

  const hasIllustration = manualBlocksList.some(id => id.endsWith("-illustration"));

  const uploadToStorage = async (file: File) => {
    const path = `${event.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("event-assets").upload(path, file);
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from("event-assets").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleIllustrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("illustration");
    try {
      const url = await uploadToStorage(file);
      const newConfig = { ...blockConfig, illustration_url: url };
      const { error } = await supabase.from("events").update({ block_config: newConfig } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.illustrationUploaded"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error(t("admin.fileUploadError"));
    }
    setUploading(null);
    if (illustrationInputRef.current) illustrationInputRef.current.value = "";
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("music");
    try {
      const url = await uploadToStorage(file);
      const newConfig = { ...blockConfig, music_url: url };
      const { error } = await supabase.from("events").update({ block_config: newConfig } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.musicUploaded"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error(t("admin.fileUploadError"));
    }
    setUploading(null);
    if (musicInputRef.current) musicInputRef.current.value = "";
  };

  const handleGenericUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("generic");
    try {
      const url = await uploadToStorage(file);
      const newFiles = [...uploadedFiles, { name: file.name, url, uploadedAt: new Date().toISOString() }];
      const newConfig = { ...blockConfig, _admin_files: newFiles };
      const { error } = await supabase.from("events").update({ block_config: newConfig } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.fileUploaded"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error(t("admin.fileUploadError"));
    }
    setUploading(null);
    if (genericInputRef.current) genericInputRef.current.value = "";
  };

  const handleDeleteFile = async (index: number) => {
    const file = uploadedFiles[index];
    try {
      const urlParts = file.url.split("/event-assets/");
      if (urlParts[1]) {
        await supabase.storage.from("event-assets").remove([decodeURIComponent(urlParts[1])]);
      }
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      const newConfig = { ...blockConfig, _admin_files: newFiles };
      await supabase.from("events").update({ block_config: newConfig } as any).eq("id", event.id);
      toast.success(t("admin.fileDeleted"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error(t("admin.fileUploadError"));
    }
  };

  const handleGoLive = async () => {
    if (!confirm(t("admin.goLiveConfirm"))) return;
    setPublishing(true);
    try {
      const { error } = await supabase.from("events").update({ status: "live" } as any).eq("id", event.id);
      if (error) throw error;
      toast.success(t("admin.eventLive"));
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch {
      toast.error(t("admin.eventLiveError"));
    }
    setPublishing(false);
  };

  return (
    <div className="space-y-6">
      {manualBlocksList.length > 0 ? (
        <div className="space-y-4">
          <p className="font-body text-sm font-semibold text-foreground">{t("admin.manualBlocks")}:</p>

          {hasIllustration && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎨</span>
                <span className="font-body text-sm font-semibold text-foreground">{t("block.illustration")}</span>
              </div>
              {blockConfig.illustration_reference && (
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">{t("admin.customerReference")}:</p>
                  <img src={blockConfig.illustration_reference} alt="Reference" className="w-full max-w-sm h-40 object-cover rounded-lg border border-border" />
                </div>
              )}
              {manualInfo[selectedBlocks.find(id => id.endsWith("-illustration")) || ""] && (
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">{t("admin.customerNote")}:</p>
                  <p className="font-body text-sm text-foreground bg-secondary/50 rounded-md p-2">{manualInfo[selectedBlocks.find(id => id.endsWith("-illustration")) || ""]}</p>
                </div>
              )}
              <div>
                <p className="font-body text-xs font-semibold text-foreground mb-1">{t("admin.uploadIllustration")}:</p>
                {blockConfig.illustration_url ? (
                  <div className="relative max-w-sm">
                    <img src={blockConfig.illustration_url} alt="Illustration" className="w-full h-40 object-cover rounded-lg border-2 border-primary" />
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">{t("admin.uploaded")}</Badge>
                  </div>
                ) : (
                  <p className="font-body text-xs text-muted-foreground italic mb-1">{t("admin.noIllustrationYet")}</p>
                )}
                <input ref={illustrationInputRef} type="file" className="hidden" onChange={handleIllustrationUpload} accept="image/*" />
                <Button variant="outline" size="sm" className="font-body mt-2" disabled={uploading === "illustration"} onClick={() => illustrationInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> {uploading === "illustration" ? "..." : blockConfig.illustration_url ? t("admin.replaceIllustration") : t("admin.uploadIllustration")}
                </Button>
              </div>
            </div>
          )}

          {hasBgMusic && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎶</span>
                <span className="font-body text-sm font-semibold text-foreground">{t("block.bgmusic")}</span>
              </div>
              {manualInfo[selectedBlocks.find(id => id.endsWith("-bgmusic")) || ""] && (
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">{t("admin.customerNote")}:</p>
                  <p className="font-body text-sm text-foreground bg-secondary/50 rounded-md p-2">{manualInfo[selectedBlocks.find(id => id.endsWith("-bgmusic")) || ""]}</p>
                </div>
              )}
              <div>
                <p className="font-body text-xs font-semibold text-foreground mb-1">{t("admin.uploadMusic")}:</p>
                {blockConfig.music_url ? (
                  <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                    <Music className="w-4 h-4 text-primary" />
                    <span className="font-body text-sm text-foreground truncate">{t("admin.musicReady")}</span>
                    <audio controls src={blockConfig.music_url} className="h-8 ml-auto" />
                  </div>
                ) : (
                  <p className="font-body text-xs text-muted-foreground italic mb-1">{t("admin.noMusicYet")}</p>
                )}
                <input ref={musicInputRef} type="file" className="hidden" onChange={handleMusicUpload} accept="audio/*" />
                <Button variant="outline" size="sm" className="font-body mt-2" disabled={uploading === "music"} onClick={() => musicInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" /> {uploading === "music" ? "..." : blockConfig.music_url ? t("admin.replaceMusic") : t("admin.uploadMusic")}
                </Button>
              </div>
            </div>
          )}

          {manualBlocksList.filter(id => !id.endsWith("-illustration") && !id.endsWith("-bgmusic")).map(id => {
            const block = blocks.find(b => b.id === id);
            return block ? (
              <div key={id} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50">
                <span className="text-lg">{block.icon}</span>
                <span className="font-body text-sm text-foreground">{t(block.nameKey)}</span>
                {block.manualWorkDescriptionKey && (
                  <span className="font-body text-xs text-muted-foreground">– {t(block.manualWorkDescriptionKey)}</span>
                )}
                {manualInfo[id] && (
                  <span className="font-body text-xs text-muted-foreground ml-2">| {manualInfo[id]}</span>
                )}
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <p className="font-body text-sm text-muted-foreground">{t("admin.noManualBlocks")}</p>
      )}

      {/* Generic file upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm font-semibold text-foreground">{t("admin.uploadedFiles")}</p>
          <div>
            <input ref={genericInputRef} type="file" className="hidden" onChange={handleGenericUpload} accept="image/*,audio/*,.pdf,.zip" />
            <Button variant="outline" size="sm" className="font-body" disabled={uploading === "generic"} onClick={() => genericInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" /> {uploading === "generic" ? "..." : t("admin.uploadFile")}
            </Button>
          </div>
        </div>

        {uploadedFiles.length === 0 ? (
          <p className="font-body text-xs text-muted-foreground italic">{t("admin.noFilesYet")}</p>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border bg-card">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 min-w-0 hover:text-primary transition-colors">
                  <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span className="font-body text-sm truncate">{file.name}</span>
                </a>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => handleDeleteFile(i)}>
                  <X className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button variant="outline" className="font-body" asChild>
          <a href={`/${event.event_link}`} target="_blank" rel="noopener noreferrer">
            <Eye className="w-4 h-4 mr-2" /> {t("admin.preview")}
          </a>
        </Button>
        {event.status !== "live" && (
          <Button className="font-body font-semibold" disabled={publishing} onClick={handleGoLive}>
            <Rocket className="w-4 h-4 mr-2" /> {publishing ? t("admin.publishing") : t("admin.goLive")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminFulfillmentPanel;
