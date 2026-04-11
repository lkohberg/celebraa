import { useState } from "react";
import { HelpCircle, CheckCircle, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { type EventLang, getEventLabel } from "@/i18n/eventLabels";
import { colorWithAlpha } from "@/lib/color-utils";
import { useSubmitQuizResponse } from "@/hooks/useEvents";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const QuizSection = ({ questions, accentColor, isPreview = false, lang, eventId }: { questions?: QuizQuestion[]; accentColor?: string; isPreview?: boolean; lang?: EventLang; eventId?: string }) => {
  const displayQuestions = questions && questions.length > 0 ? questions : [];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const color = accentColor || "hsl(340, 65%, 50%)";
  const l = (key: string) => lang ? getEventLabel(lang, key) : getEventLabel("de", key);
  const submitResponse = useSubmitQuizResponse();

  if (displayQuestions.length === 0) return null;

  const finished = currentQ >= displayQuestions.length - 1 && selected !== null;
  const question = displayQuestions[currentQ];

  const handleSelect = (optionIndex: number) => {
    if (isPreview || selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore(s => s + 1);

    if (eventId) {
      submitResponse.mutate({
        event_id: eventId,
        question_index: currentQ,
        selected_option: optionIndex,
      });
    }
  };

  return (
    <section className="py-12 pb-16 md:py-20 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/50" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`, backgroundSize: "32px 32px" }} />

      <div className="relative max-w-xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3" style={{ backgroundColor: colorWithAlpha(color, 0.15) }}>
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6" style={{ color }} />
          </div>
          <h2 className="font-display text-xl md:text-3xl text-foreground">{l("quiz")}</h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
            <Sparkles className="w-3 h-3" style={{ color, opacity: 0.4 }} />
            <div className="w-12 h-px" style={{ backgroundColor: color, opacity: 0.3 }} />
          </div>
          <p className="font-body text-sm text-muted-foreground mt-2">{l("quizSubtitle")}</p>
        </motion.div>

        <motion.div layout className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-border/50 shadow-sm">
          <div className="flex gap-1.5 mb-4 md:mb-6">
            {displayQuestions.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: i <= currentQ ? "100%" : "0%" }} transition={{ duration: 0.3 }} />
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-muted-foreground mb-1">
            {l("questionOf").replace("{current}", String(currentQ + 1)).replace("{total}", String(displayQuestions.length))}
          </p>
          <h3 className="font-display text-base md:text-xl text-foreground mb-4">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={isPreview ? {} : { scale: 0.98 }}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3 md:p-4 rounded-xl border font-body text-sm transition-all duration-200 ${
                  selected === i
                    ? i === question.correctIndex ? "border-green-400 bg-green-50 text-green-800 shadow-sm" : "border-red-300 bg-red-50 text-red-800"
                    : selected !== null && i === question.correctIndex ? "border-green-400 bg-green-50/50 text-green-800"
                    : "border-border/50 bg-background hover:border-border hover:shadow-sm text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-6 h-6 md:w-7 md:h-7 rounded-full border flex items-center justify-center text-xs font-medium shrink-0" style={{
                    borderColor: selected === i ? (i === question.correctIndex ? "#4ade80" : "#f87171") : colorWithAlpha(color, 0.3),
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
              <Button className="mt-4 font-body w-full" onClick={() => { setCurrentQ(prev => prev + 1); setSelected(null); }} disabled={isPreview}>
                {l("nextQuestion")}
              </Button>
            </motion.div>
          )}
          {finished && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-5 text-center p-4 rounded-xl" style={{ backgroundColor: colorWithAlpha(color, 0.1) }}>
              <Trophy className="w-7 h-7 mx-auto mb-2" style={{ color }} />
              <p className="font-display text-base md:text-lg text-foreground">
                {l("correctCount").replace("{score}", String(score)).replace("{total}", String(displayQuestions.length))}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection;
