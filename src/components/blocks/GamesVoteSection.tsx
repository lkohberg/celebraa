import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameOption {
  name: string;
  votes: number;
}

const demoGames: GameOption[] = [
  { name: "Beer Pong 🍺", votes: 12 },
  { name: "Karaoke 🎤", votes: 8 },
  { name: "Flunkyball ⚽", votes: 15 },
  { name: "Wer bin ich? 🤔", votes: 6 },
];

const GamesVoteSection = ({ games, accentColor, isPreview = false }: { games?: GameOption[]; accentColor?: string; isPreview?: boolean }) => {
  const [displayGames, setDisplayGames] = useState(games && games.length > 0 ? games : demoGames);
  const [voted, setVoted] = useState(false);
  const color = accentColor || "hsl(340, 65%, 50%)";
  const maxVotes = Math.max(...displayGames.map(g => g.votes));

  return (
    <section className="py-20 bg-card">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <Gamepad2 className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Spiele-Abstimmung</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Stimme ab, welche Spiele wir spielen!</p>
        </div>
        <div className="space-y-3">
          {displayGames.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-background rounded-lg border border-border overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 opacity-15 transition-all"
                style={{ width: `${(game.votes / maxVotes) * 100}%`, backgroundColor: color }}
              />
              <div className="relative flex items-center justify-between p-4">
                <span className="font-body text-sm font-medium text-foreground">{game.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-muted-foreground">{game.votes} Stimmen</span>
                  {!voted && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-body text-xs h-7"
                      onClick={() => {
                        if (isPreview) return;
                        const updated = [...displayGames];
                        updated[i] = { ...updated[i], votes: updated[i].votes + 1 };
                        setDisplayGames(updated);
                        setVoted(true);
                      }}
                      disabled={isPreview}
                    >
                      Vote
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
