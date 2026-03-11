import { useState, useEffect, useRef } from "react";
import { Camera, Sparkles, Upload, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const demoImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop",
];

const SlideshowSection = ({ images, accentColor, lang, eventId, isPreview = false }: { images?: string[]; accentColor?: string; lang?: EventLang; eventId?: string; isPreview?: boolean }) => {
  const [guestPhotos, setGuestPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const allImages = [
    ...(images && images.length > 0 ? images : []),
    ...guestPhotos,
  ];
  const displayImages = allImages.length > 0 ? allImages : demoImages;
  const [current, setCurrent] = useState(0);
  const color = accentColor || "hsl(38, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  // Load guest photos
  useEffect(() => {
    if (!eventId || isPreview) return;
    const loadPhotos = async () => {
      const { data } = await supabase
        .from("guest_photos" as any)
        .select("photo_url")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (data) {
        setGuestPhotos((data as any[]).map((p: any) => p.photo_url));
      }
    };
    loadPhotos();
  }, [eventId, isPreview]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % displayImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  const handleUpload = async (files: FileList) => {
    if (!eventId || isPreview) return;
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        
        const path = `${eventId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("guest-photos")
          .upload(path, file);
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from("guest-photos")
          .getPublicUrl(path);
        
        const { error: insertError } = await supabase
          .from("guest_photos" as any)
          .insert({
            event_id: eventId,
            photo_url: urlData.publicUrl,
            guest_name: guestName || null,
          } as any);
        if (insertError) throw insertError;
        
        setGuestPhotos(prev => [urlData.publicUrl, ...prev]);
      }
      toast.success(l("photoUploaded") || "📸 Foto hochgeladen!");
    } catch (err) {
      console.error(err);
      toast.error(l("saveError") || "Fehler beim Hochladen");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
      <div className="relative max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Camera className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("slideshow")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
        </motion.div>

        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
          <AnimatePresence mode="wait">
            <motion.img key={current} src={displayImages[current]} alt="" className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayImages.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className="transition-all duration-300">
                <div className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Guest photo upload */}
        {eventId && !isPreview && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.12) }}>
              <ImagePlus className="w-5 h-5" style={{ color }} />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              {l("uploadYourPhotos") || "Teile deine Fotos"}
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4">
              {l("uploadPhotosHint") || "Lade deine schönsten Momente hoch!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
              <Input
                placeholder={l("yourName") || "Dein Name"}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="font-body text-sm"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
              />
              <Button
                variant="outline"
                className="font-body whitespace-nowrap"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                style={{ borderColor: colorWithAlpha(color, 0.3), color }}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "..." : (l("uploadPhoto") || "Fotos hochladen")}
              </Button>
            </div>
            {guestPhotos.length > 0 && (
              <p className="font-body text-xs text-muted-foreground mt-3">
                {guestPhotos.length} {l("photosShared") || "Fotos geteilt"} 📸
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SlideshowSection;
