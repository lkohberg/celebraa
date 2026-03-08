import { useState } from "react";
import { HelpCircle, CheckCircle, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const demoQuestions: QuizQuestion[] = [
  { question: "Was ist Sarahs Lieblings-Reiseziel?", options: ["Paris", "Bali", "New York", "Wien"], correctIndex: 1 },
  { question: "Welches Hobby hat Sarah als Kind gehabt?", options: ["Tanzen", "Reiten", "Malen", "Schwimmen"], correctIndex: 2 },
];

const QuizSection = ({ questions, accentColor, isPreview = false }: { questions?: QuizQuestion[]; accentColor?: string; isPreview?: boolean }) => {
  const displayQuestions = questions && questions.length > 0 ? questions : demoQuestions;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const color = accentColor || "hsl(340, 65%, 50%)";
  const finished = currentQ >= displayQuestions.length - 1 && selected !== null;

  const question = displayQuestions[currentQ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Fun background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/50" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`, backgroundSize: "32px 32px" }} />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: `${color}15` }}>
            <HelpCircle className="w-6 h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Quiz</h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-3">Wie gut kennst du das Geburtstagskind?</p>
        </motion.div>

        <motion.div
          layout
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm"
        >
          {/* Progress bar */}
          <div className="flex gap-1.5 mb-6">
            {displayQuestions.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: i <= currentQ ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-muted-foreground mb-1">Frage {currentQ + 1} von {displayQuestions.length}</p>
          <h3 className="font-display text-lg md:text-xl text-foreground mb-5">{question.question}</h3>
          <div className="space-y-2.5">
            {question.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={isPreview ? {} : { scale: 0.98 }}
                onClick={() => {
                  if (isPreview || selected !== null) return;
                  setSelected(i);
                  if (i === question.correctIndex) setScore(s => s + 1);
                }}
                className={`w-full text-left p-4 rounded-xl border font-body text-sm transition-all duration-200 ${
                  selected === i
                    ? i === question.correctIndex
                      ? "border-green-400 bg-green-50 text-green-800 shadow-sm"
                      : "border-red-300 bg-red-50 text-red-800"
                    : selected !== null && i === question.correctIndex
                      ? "border-green-400 bg-green-50/50 text-green-800"
                      : "border-border/50 bg-background hover:border-border hover:shadow-sm text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium shrink-0" style={{
                    borderColor: selected === i ? (i === question.correctIndex ? "#4ade80" : "#f87171") : `${color}30`,
                    color: selected === i ? (i === question.correctIndex ? "#16a34a" : "#dc2626") : color,
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {selected !== null && i === question.correctIndex && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
                </span>
              </motion.button>
            ))}
          </div>
          {selected !== null && currentQ < displayQuestions.length - 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button className="mt-5 font-body w-full" onClick={() => { setCurrentQ(prev => prev + 1); setSelected(null); }} disabled={isPreview}>
                Nächste Frage →
              </Button>
            </motion.div>
          )}
          {finished && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 text-center p-4 rounded-xl" style={{ backgroundColor: `${color}10` }}>
              <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color }} />
              <p className="font-display text-lg text-foreground">{score}/{displayQuestions.length} richtig!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection;
