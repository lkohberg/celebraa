import { useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";

interface GameOption {
  name: string;
  emoji?: string;
  votes: number;
}

const GamesVoteSection = ({ games, accentColor, isPreview = false, lang }: { games?: GameOption[]; accentColor?: string; isPreview?: boolean; lang?: EventLang }) => {
  const [displayGames, setDisplayGames] = useState(games && games.length > 0 ? games : []);
  const [voted, setVoted] = useState(false);
  const color = accentColor || "hsl(340, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);
  const maxVotes = Math.max(...displayGames.map(g => g.votes), 1);

  if (displayGames.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-card/80" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <Gamepad2 className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{l("gamesVote")}</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">{l("gamesVoteSubtitle")}</p>
        </motion.div>

        <div className="space-y-3">
          {displayGames.map((game, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:shadow-sm transition-shadow">
              <motion.div className="absolute inset-y-0 left-0 opacity-10" style={{ backgroundColor: color }} initial={{ width: 0 }} whileInView={{ width: `${(game.votes / maxVotes) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} />
              <div className="relative flex items-center justify-between p-4">
                <span className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                  {game.emoji && <span className="text-lg">{game.emoji}</span>}
                  {game.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-muted-foreground font-medium">{game.votes}</span>
                  {!voted && (
                    <Button size="sm" variant="outline" className="font-body text-xs h-8 px-3 rounded-lg" onClick={() => { if (isPreview) return; const updated = [...displayGames]; updated[i] = { ...updated[i], votes: updated[i].votes + 1 }; setDisplayGames(updated); setVoted(true); }} disabled={isPreview}>
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
