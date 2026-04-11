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
      {/* Vertical line – always centered */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-px" style={{ backgroundColor: accentColor, opacity: 0.2 }} />

      <div className="space-y-3 md:space-y-10">
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
                className="absolute left-1/2 top-3 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full -translate-x-1.5 z-10 ring-[3px] md:ring-4 ring-background"
                style={{ backgroundColor: accentColor }}
              />

              {/* Alternating left/right */}
              <div className="grid grid-cols-2 gap-2 md:gap-8">
                {isLeft ? (
                  <>
                    <div className="flex justify-end">
                      <div className="bg-card/60 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/30 p-2.5 md:p-5 shadow-sm max-w-sm text-right">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[9px] md:text-xs font-medium mb-1 tracking-wide"
                          style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                        >
                          {item.time}
                        </span>
                        <p className="font-display text-xs md:text-lg text-foreground">{item.label}</p>
                      </div>
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="flex justify-start">
                      <div className="bg-card/60 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/30 p-2.5 md:p-5 shadow-sm max-w-sm">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[9px] md:text-xs font-medium mb-1 tracking-wide"
                          style={{ backgroundColor: accentColor + "1a", color: accentColor }}
                        >
                          {item.time}
                        </span>
                        <p className="font-display text-xs md:text-lg text-foreground">{item.label}</p>
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
