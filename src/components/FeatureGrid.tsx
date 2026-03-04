import { motion } from "framer-motion";
import { Link2, QrCode, Zap } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Kein WhatsApp-Chaos",
    description:
      "Alle Gäste erhalten einen professionellen Link und Zusagen werden automatisch gesammelt.",
  },
  {
    icon: QrCode,
    title: "QR-Code inklusive",
    description:
      "Perfekt für gedruckte Karten oder Social Media – scannen und sofort zusagen.",
  },
  {
    icon: Zap,
    title: "In 3 Tagen online",
    description:
      "Deine Seite ist innerhalb von drei Tagen nach Bestellung verfügbar.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeatureGrid = () => {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Warum Celebra.at?
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-md mx-auto">
            Drei gute Gründe für deine digitale Einladung
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {f.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;
