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
    <div className="relative max-w-lg mx-auto py-4">
      {/* Vertical line - starts at first dot, ends at last dot */}
      <div
        className="absolute left-1/2 -translate-x-px opacity-30 w-[2px]"
        style={{
          backgroundColor: accentColor,
          top: "calc(1.25rem + 8px)",
          bottom: `calc(${(schedule.length - 1) > 0 ? "1.25rem + 8px" : "100%"})`,
        }}
      />

      <div className="space-y-0">
        {schedule.map((item, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={i}
              className="relative flex items-center py-5"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Left side */}
              <div className={`w-[calc(50%-20px)] ${isLeft ? "text-right pr-6" : ""}`}>
                {isLeft && (
                  <>
                    <p className="font-display text-base font-semibold text-foreground leading-tight">
                      {item.label}
                    </p>
                    <p
                      className="font-body text-xs tracking-widest uppercase mt-1"
                      style={{ color: accentColor }}
                    >
                      {item.time} Uhr
                    </p>
                  </>
                )}
              </div>

              {/* Center dot */}
              <div className="relative z-10 flex items-center justify-center w-10 shrink-0">
                <div
                  className="w-4 h-4 rounded-full border-[3px] bg-background shadow-sm"
                  style={{ borderColor: accentColor }}
                />
              </div>

              {/* Right side */}
              <div className={`w-[calc(50%-20px)] ${!isLeft ? "pl-6" : ""}`}>
                {!isLeft && (
                  <>
                    <p className="font-display text-base font-semibold text-foreground leading-tight">
                      {item.label}
                    </p>
                    <p
                      className="font-body text-xs tracking-widest uppercase mt-1"
                      style={{ color: accentColor }}
                    >
                      {item.time} Uhr
                    </p>
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
