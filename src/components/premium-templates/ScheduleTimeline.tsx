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
    <div className="relative max-w-md mx-auto">
      {/* Vertical line */}
      <div
        className="absolute left-[72px] top-2 bottom-2 w-px"
        style={{ backgroundColor: accentColor, opacity: 0.3 }}
      />

      <div className="space-y-6">
        {schedule.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {/* Time */}
            <span
              className="font-body text-sm w-14 text-right shrink-0 tabular-nums"
              style={{ color: accentColor }}
            >
              {item.time}
            </span>

            {/* Dot */}
            <div
              className="w-3 h-3 rounded-full shrink-0 border-2 bg-background"
              style={{ borderColor: accentColor }}
            />

            {/* Label */}
            <span className="font-body text-sm text-foreground">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTimeline;
