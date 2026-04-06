import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Video, Mic, Heart, MessageCircle } from "lucide-react";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";

interface VideoMessageSectionProps {
  accentColor?: string;
  lang?: EventLang;
  blockConfig?: any;
  variant?: "wedding" | "birthday" | "corporate";
}

/** Duck (lower volume) or restore background music when this section's media plays/pauses */
const duckBgMusic = (duck: boolean) => {
  const bgAudio = (window as any).__celebra_bg_audio as HTMLAudioElement | undefined;
  if (!bgAudio) return;
  bgAudio.volume = duck ? 0.05 : 0.3;
};

const VideoMessageSection = ({ accentColor, lang, blockConfig, variant = "wedding" }: VideoMessageSectionProps) => {
  const color = accentColor || "hsl(38, 65%, 50%)";
  const mediaUrl = blockConfig?.video_message_url;
  const mediaType = blockConfig?.video_message_type || "video"; // "video" or "audio"

  const isCorporate = variant === "corporate";
  const label = lang
    ? getEventLabel(lang, isCorporate ? "promoVideo" : "personalMessage")
    : (isCorporate ? "Promo-Video" : "Persönliche Nachricht");
  const subtitle = lang
    ? getEventLabel(lang, isCorporate ? "promoVideoSub" : "personalMessageSub")
    : (isCorporate ? "Ein Video oder eine Nachricht für Sie" : "Eine Nachricht an euch");

  return (
    <section className="py-20 relative overflow-hidden bg-card">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            {mediaType === "audio" ? (
              <Mic className="w-6 h-6" style={{ color }} />
            ) : (
              <Video className="w-6 h-6" style={{ color }} />
            )}
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{label}</h2>
          <p className="font-body text-sm text-muted-foreground mb-8">{subtitle}</p>

          {mediaUrl ? (
            mediaType === "audio" ? (
              <div className="bg-background/60 backdrop-blur-sm rounded-2xl border border-border/30 p-6">
                <audio controls className="w-full" src={mediaUrl}
                  onPlay={() => duckBgMusic(true)}
                  onPause={() => duckBgMusic(false)}
                  onEnded={() => duckBgMusic(false)}
                >
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-border/30 shadow-sm">
                <video
                  controls
                  className="w-full"
                  src={mediaUrl}
                  preload="metadata"
                  playsInline
                  onPlay={() => duckBgMusic(true)}
                  onPause={() => duckBgMusic(false)}
                  onEnded={() => duckBgMusic(false)}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )
          ) : (
            /* Placeholder when no media uploaded yet */
            <div className="rounded-2xl overflow-hidden border border-border/30 shadow-sm">
              <div className="aspect-video bg-gradient-to-br from-secondary via-card to-secondary flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
                <div className="text-center relative">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colorWithAlpha(color, 0.1) }}>
                    {isCorporate ? (
                      <Video className="w-8 h-8" style={{ color, opacity: 0.5 }} />
                    ) : (
                      <Heart className="w-8 h-8" style={{ color, opacity: 0.5 }} />
                    )}
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    {lang ? getEventLabel(lang, "messagePlaceholder") : "Wird bald verfügbar sein"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoMessageSection;
