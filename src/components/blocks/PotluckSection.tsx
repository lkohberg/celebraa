import { useState } from "react";
import { ShoppingBasket, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";
import { usePotluckClaims, useClaimPotluckItem } from "@/hooks/useEvents";
import { toast } from "sonner";
import { useGuestName } from "@/hooks/useGuestName";

interface PotluckItem {
  name?: string;
  item?: string;
  claimedBy?: string;
  assignedTo?: string;
}

const PotluckSection = ({ items, accentColor, isPreview = false, lang, eventId }: { items?: PotluckItem[]; accentColor?: string; isPreview?: boolean; lang?: EventLang; eventId?: string }) => {
  const normalized = (items && items.length > 0 ? items : []).map(i => ({
    name: i.name || i.item || "",
    claimedBy: i.claimedBy || i.assignedTo || "",
  }));
  const color = accentColor || "hsl(340, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  const { data: claims } = usePotluckClaims(eventId || "");
  const claimMutation = useClaimPotluckItem();
  const { guestName: sharedName, setGuestName: setSharedName } = useGuestName();
  const [claimName, setClaimName] = useState("");
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null);

  if (normalized.length === 0) return null;

  // Build a map of claimed items from DB
  const claimedMap: Record<string, string> = {};
  claims?.forEach((c: any) => {
    claimedMap[c.item_name] = c.claimed_by;
  });

  const handleClaim = (itemName: string, index: number) => {
    if (isPreview || !eventId) return;
    if (claimingIndex === index) {
      const finalName = (claimName || sharedName).trim();
      if (!finalName) return;
      claimMutation.mutate(
        { event_id: eventId, item_name: itemName, claimed_by: finalName },
        {
          onSuccess: () => {
            setClaimingIndex(null);
            setClaimName("");
            setSharedName(finalName);
          },
          onError: () => {
            toast.error(l("potluckAlreadyClaimed") || "Dieses Item wurde bereits beansprucht.");
          },
        }
      );
    } else {
      setClaimingIndex(index);
      setClaimName("");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/80 to-card" />
      <div className="relative max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <ShoppingBasket className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("potluck")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">{l("potluckSubtitle")}</p>
        </motion.div>

        <div className="space-y-2.5">
          {normalized.map((item, i) => {
            const dbClaimed = claimedMap[item.name];
            const isClaimed = !!dbClaimed || !!item.claimedBy;
            const claimedByName = dbClaimed || item.claimedBy;

            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex flex-col p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isClaimed ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100"><Check className="w-3.5 h-3.5 text-green-600" /></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-border" />
                    )}
                    <span className={`font-body text-sm ${isClaimed ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>{item.name}</span>
                  </div>
                  {isClaimed ? (
                    <span className="font-body text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">{claimedByName}</span>
                  ) : (
                    <Button size="sm" variant="outline" className="font-body text-xs h-8 rounded-lg" disabled={isPreview || claimMutation.isPending} onClick={() => handleClaim(item.name, i)}>
                      {claimingIndex === i ? "✓" : l("potluckClaim")}
                    </Button>
                  )}
                </div>
                {claimingIndex === i && !isClaimed && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder={l("potluckYourName") || "Dein Name"}
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      className="font-body text-sm flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleClaim(item.name, i)}
                    />
                    <Button size="sm" className="font-body text-xs" disabled={!claimName.trim() || claimMutation.isPending} onClick={() => handleClaim(item.name, i)}>
                      {l("potluckConfirm") || "Bestätigen"}
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PotluckSection;
