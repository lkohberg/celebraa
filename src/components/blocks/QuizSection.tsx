import { useState } from "react";
import { HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  const color = accentColor || "hsl(340, 65%, 50%)";

  const question = displayQuestions[currentQ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <HelpCircle className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Quiz</h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Wie gut kennst du das Geburtstagskind?</p>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <p className="font-body text-xs text-muted-foreground mb-2">Frage {currentQ + 1} von {displayQuestions.length}</p>
          <h3 className="font-display text-lg text-foreground mb-4">{question.question}</h3>
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={isPreview ? {} : { scale: 0.98 }}
                onClick={() => !isPreview && setSelected(i)}
                className={`w-full text-left p-3 rounded-lg border font-body text-sm transition-all ${
                  selected === i
                    ? i === question.correctIndex
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-red-400 bg-red-50 text-red-800"
                    : "border-border bg-background hover:border-primary/30 text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {selected === i && i === question.correctIndex && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {opt}
                </span>
              </motion.button>
            ))}
          </div>
          {selected !== null && currentQ < displayQuestions.length - 1 && (
            <Button className="mt-4 font-body" onClick={() => { setCurrentQ(prev => prev + 1); setSelected(null); }} disabled={isPreview}>
              Nächste Frage
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
