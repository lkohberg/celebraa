import { motion } from "framer-motion";

interface ScheduleItem {
  time: string;
  label: string;
}

interface ScheduleTimelineProps {
  schedule: ScheduleItem[];
  accentColor?: string;
}

const ScheduleTimeline = ({ schedule, accentColor = "hsl(150, 18%, 38%)" }: ScheduleTimelineProps) => {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="relative">
      {/* Vertical line – left on mobile, centered on desktop */}
      <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-px md:-translate-x-px" style={{ backgroundColor: accentColor, opacity: 0.2 }} />

      <div className="space-y-4 md:space-y-10">
        {schedule.map((item, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className="absolute left-5 md:left-1/2 top-3 w-3 h-3 rounded-full -translate-x-1.5 z-10 ring-4 ring-background"
                style={{ backgroundColor: accentColor }}
              />

              {/* Mobile: always right of the line */}
              <div className="md:hidden pl-14 pr-2">
                <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-4 shadow-sm">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-1.5 tracking-wide"
                    style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                  >
                    {item.time}
                  </span>
                  <p className="font-display text-base text-foreground">{item.label}</p>
                </div>
              </div>

              {/* Desktop: alternating left/right */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-8">
                {isLeft ? (
                  <>
                    <div className="flex justify-end">
                      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm max-w-sm text-right">
                        <span
                          className="inline-block px-3 py-0.5 rounded-full text-xs font-medium mb-2 tracking-wide"
                          style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                        >
                          {item.time}
                        </span>
                        <p className="font-display text-lg text-foreground">{item.label}</p>
                      </div>
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="flex justify-start">
                      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm max-w-sm">
                        <span
                          className="inline-block px-3 py-0.5 rounded-full text-xs font-medium mb-2 tracking-wide"
                          style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                        >
                          {item.time}
                        </span>
                        <p className="font-display text-lg text-foreground">{item.label}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleTimeline;
