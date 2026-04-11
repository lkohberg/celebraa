import { useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";
import { useGameVotes, useSubmitGameVote } from "@/hooks/useEvents";
import { toast } from "sonner";
import { useGuestName } from "@/hooks/useGuestName";

interface GameOption {
  name: string;
  emoji?: string;
  votes: number;
}

const GamesVoteSection = ({ games, accentColor, isPreview = false, lang, eventId }: { games?: GameOption[]; accentColor?: string; isPreview?: boolean; lang?: EventLang; eventId?: string }) => {
  const displayGames = games && games.length > 0 ? games : [];
  const [voted, setVoted] = useState(false);
  const { guestName: sharedName, setGuestName: setSharedName } = useGuestName();
  const [voterName, setVoterName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [pendingGame, setPendingGame] = useState<string | null>(null);
  const color = accentColor || "hsl(340, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);

  const { data: dbVotes } = useGameVotes(eventId || "");
  const submitVote = useSubmitGameVote();

  if (displayGames.length === 0) return null;

  const voteCountMap: Record<string, number> = {};
  dbVotes?.forEach((v: any) => {
    voteCountMap[v.game_name] = (voteCountMap[v.game_name] || 0) + 1;
  });

  const gamesWithVotes = displayGames.map(g => ({
    ...g,
    votes: (voteCountMap[g.name] || 0) + (g.votes || 0),
  }));

  const maxVotes = Math.max(...gamesWithVotes.map(g => g.votes), 1);

  const handleVote = (gameName: string) => {
    if (isPreview || !eventId || voted) return;
    const currentName = voterName || sharedName;
    if (!showNameInput && !currentName) {
      setShowNameInput(true);
      setPendingGame(gameName);
      return;
    }
    const finalName = currentName.trim();
    if (!finalName) {
      setPendingGame(gameName);
      return;
    }
    submitVote.mutate(
      { event_id: eventId, game_name: gameName, guest_name: finalName },
      {
        onSuccess: () => { setVoted(true); setShowNameInput(false); setSharedName(finalName); },
        onError: () => toast.error("Du hast bereits abgestimmt."),
      }
    );
  };

  return (
    <section className="py-12 pb-16 md:py-20 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-card/80" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-xl md:text-3xl text-foreground">{l("gamesVote")}</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-2">{l("gamesVoteSubtitle")}</p>
        </motion.div>

        {showNameInput && !voted && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <Input
              placeholder={l("potluckYourName") || "Dein Name"}
              value={voterName || sharedName}
              onChange={(e) => { setVoterName(e.target.value); setSharedName(e.target.value); }}
              className="font-body text-sm"
            />
          </motion.div>
        )}

        <div className="space-y-2.5">
          {gamesWithVotes.map((game, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:shadow-sm transition-shadow">
              <motion.div className="absolute inset-y-0 left-0 opacity-10" style={{ backgroundColor: color }} initial={{ width: 0 }} whileInView={{ width: `${(game.votes / maxVotes) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} />
              <div className="relative flex items-center justify-between p-3 md:p-4">
                <span className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                  {game.emoji && <span className="text-lg">{game.emoji}</span>}
                  {game.name}
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="font-body text-xs text-muted-foreground font-medium">{game.votes}</span>
                  {!voted && (
                    <Button size="sm" variant="outline" className="font-body text-xs h-7 md:h-8 px-2.5 md:px-3 rounded-lg" onClick={() => handleVote(game.name)} disabled={isPreview || submitVote.isPending || (showNameInput && !(voterName || sharedName).trim())}>
                      👍 Vote
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesVoteSection;
