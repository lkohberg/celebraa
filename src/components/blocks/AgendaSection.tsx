import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

const demoAgenda: AgendaItem[] = [
  { time: "09:00 – 09:30", title: "Registrierung & Networking", description: "Kaffee und Empfang" },
  { time: "09:30 – 10:30", title: "Keynote: Zukunft der Branche", speaker: "Dr. Maria Schmidt" },
  { time: "10:30 – 11:00", title: "Kaffeepause" },
  { time: "11:00 – 12:30", title: "Panel: Innovation & Strategie", speaker: "Div. Speaker" },
  { time: "12:30 – 14:00", title: "Mittagspause & Networking" },
  { time: "14:00 – 16:00", title: "Workshops (parallel)", description: "Wählen Sie aus 3 Workshops" },
];

const AgendaSection = ({ agenda, accentColor }: { agenda?: AgendaItem[]; accentColor?: string }) => {
  const displayAgenda = agenda && agenda.length > 0 ? agenda : demoAgenda;
  const color = accentColor || "hsl(220, 50%, 35%)";

  return (
    <section className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <ClipboardList className="w-6 h-6 mx-auto mb-3" style={{ color }} />
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Agenda</h2>
        </div>
        <div className="space-y-3">
          {displayAgenda.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-4 bg-card rounded-lg border border-border"
            >
              <div className="font-body text-sm font-semibold min-w-[120px]" style={{ color }}>{item.time}</div>
              <div className="flex-1">
                <p className="font-body font-medium text-foreground">{item.title}</p>
                {item.speaker && <p className="font-body text-xs text-muted-foreground mt-0.5">🎤 {item.speaker}</p>}
                {item.description && <p className="font-body text-xs text-muted-foreground mt-0.5">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
