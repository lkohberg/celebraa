import { motion } from "framer-motion";
import { type ReactNode } from "react";

type RevealVariant = "fade-up" | "fade-scale" | "slide-left" | "slide-right" | "fade-wipe" | "fade";

interface RevealSectionProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "section" | "div" | "footer";
}

const variants: Record<RevealVariant, { initial: any; whileInView: any }> = {
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  "fade-scale": {
    initial: { opacity: 0, y: 30, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
  },
  "slide-left": {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
  },
  "fade-wipe": {
    initial: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    whileInView: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
  },
  fade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
  },
};

const RevealSection = ({
  children,
  variant = "fade-up",
  delay = 0,
  className,
  style,
  as = "section",
}: RevealSectionProps) => {
  const Tag = motion[as];
  const v = variants[variant];

  return (
    <Tag
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default RevealSection;
