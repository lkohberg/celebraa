interface SectionBackgroundProps {
  variant: "watercolor" | "mesh" | "geometric" | "subtle-gradient";
  accentColor: string;
  secondaryColor?: string;
}

const SectionBackground = ({ variant, accentColor, secondaryColor }: SectionBackgroundProps) => {
  switch (variant) {
    case "watercolor":
      return (
        <>
          <div
            className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${secondaryColor || "hsl(340, 50%, 80%)"}, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }}
          />
        </>
      );

    case "mesh":
      return (
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, ${accentColor}, transparent 50%),
              radial-gradient(ellipse at 80% 20%, ${secondaryColor || "hsl(280, 60%, 55%)"}, transparent 50%),
              radial-gradient(ellipse at 60% 80%, ${accentColor}, transparent 50%)
            `,
          }}
        />
      );

    case "geometric":
      return (
        <>
          <div
            className="absolute inset-0 opacity-[0.018] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute top-0 right-0 w-[200px] h-full opacity-[0.03] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, transparent)`,
            }}
          />
        </>
      );

    case "subtle-gradient":
      return (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, transparent 50%, ${secondaryColor || accentColor} 100%)`,
          }}
        />
      );

    default:
      return null;
  }
};

export default SectionBackground;
