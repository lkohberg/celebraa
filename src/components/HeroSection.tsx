import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gold gradient orb */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-body font-medium text-muted-foreground">
              Digitale Einladungen neu gedacht
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
            Deine digitale Event-Einladung
            <br />
            <span className="text-primary">in Minuten erstellt</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Modern · Persönlich · Mit RSVP
          </p>
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            QR-Code und eigenem Link – alles was du brauchst.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 font-body font-semibold"
              onClick={() => navigate("/templates")}
            >
              Jetzt Design auswählen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 font-body font-semibold"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              So funktioniert es
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20"
        >
          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground font-body">
            <span>✓ Keine App nötig</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>✓ DSGVO-konform</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>✓ In 3 Tagen online</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
