import { useState, useEffect } from "react";
import { useSubmitRsvp } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { useGuestName } from "@/hooks/useGuestName";
import { colorWithAlpha } from "@/lib/color-utils";

interface RsvpFormProps {
  eventId: string;
  rsvpDeadline?: string | null;
  menuSelection?: boolean;
  variant?: "wedding" | "birthday" | "corporate";
  lang?: EventLang;
  maxCompanions?: number;
}

const variantStyles = {
  wedding: {
    bg: "#FAF6F1",
    cardBg: "#FDFBF8",
    text: "#3D3228",
    accent: "#8B7355",
    inputBg: "#FDFBF8",
    inputBorder: "#E8DFD4",
    font: "'Cormorant Garamond', serif",
    radius: "0px",
  },
  birthday: {
    bg: "#0A0A0F",
    cardBg: "rgba(255,255,255,0.03)",
    text: "#FAFAFA",
    accent: "#E040FB",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.08)",
    font: "'Space Grotesk', sans-serif",
    radius: "12px",
  },
  corporate: {
    bg: "#FAFAFA",
    cardBg: "#FFFFFF",
    text: "#111111",
    accent: "#2563EB",
    inputBg: "#FFFFFF",
    inputBorder: "rgba(17,17,17,0.1)",
    font: "'Inter', sans-serif",
    radius: "0px",
  },
};

const RsvpForm = ({ eventId, rsvpDeadline, menuSelection, variant = "wedding", lang, maxCompanions = 5 }: RsvpFormProps) => {
  const { t } = useTranslation();
  const labels = lang ? getEventLabels(lang) : null;
  const submitRsvp = useSubmitRsvp();
  const { guestName: sharedName, setGuestName: setSharedName } = useGuestName();
  const [name, setName] = useState(sharedName || "");
  const [nameEditedLocally, setNameEditedLocally] = useState(false);

  useEffect(() => {
    if (sharedName && !nameEditedLocally) setName(sharedName);
  }, [sharedName]);

  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"accepted" | "declined" | null>(null);
  const [companionCount, setCompanionCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [menuChoice, setMenuChoice] = useState("");

  const s = variantStyles[variant];

  const handleCompanionCountChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, maxCompanions));
    setCompanionCount(clamped);
    setCompanionNames(prev => {
      const updated = [...prev];
      while (updated.length < clamped) updated.push("");
      return updated.slice(0, clamped);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance) {
      toast.error(t("event.attending") + " / " + t("event.notAttending"));
      return;
    }
    if (!name.trim()) return;

    try {
      await submitRsvp.mutateAsync({
        event_id: eventId,
        name: name.trim(),
        email: email || undefined,
        rsvp_status: attendance,
        plus_one: companionCount > 0,
        companion_count: companionCount,
        companion_names: companionNames.filter(n => n.trim()),
        message: message || undefined,
        menu_choice: menuChoice || undefined,
      });
      toast.success(t("event.thankYou"));
      setName(""); setEmail(""); setAttendance(null);
      setCompanionCount(0); setCompanionNames([]); setMessage(""); setMenuChoice("");
    } catch {
      toast.error(t("event.rsvpError"));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    backgroundColor: s.inputBg,
    border: `1px solid ${s.inputBorder}`,
    borderRadius: s.radius,
    color: s.text,
    fontFamily: s.font,
    outline: "none",
    transition: "border-color 0.2s",
  };

  const companionLabel = labels?.companions || t("event.companions") || "Begleitpersonen";

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: s.bg }}>
      <div className="max-w-lg mx-auto px-6">
        <div className="text-center mb-12">
          {variant === "corporate" && (
            <div className="w-full h-[2px] mb-8" style={{ background: `linear-gradient(90deg, transparent 0%, ${s.accent} 50%, transparent 100%)` }} />
          )}
          <h2
            className="text-2xl md:text-3xl mb-3"
            style={{
              fontFamily: s.font,
              fontWeight: variant === "wedding" ? 300 : variant === "birthday" ? 700 : 600,
              color: s.text,
              letterSpacing: variant === "corporate" ? "-0.01em" : undefined,
            }}
          >
            {variant === "corporate" ? (labels?.register || t("event.register")) : (labels?.rsvp || t("event.rsvp"))}
          </h2>
          {variant === "wedding" && (
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="mx-auto my-4" style={{ opacity: 0.3 }}>
              <path d="M0 10 Q10 2 20 10 Q30 18 40 10 Q50 2 60 10" stroke={s.accent} strokeWidth="0.8" fill="none" />
            </svg>
          )}
          {rsvpDeadline && (
            <p className="text-sm" style={{ color: colorWithAlpha(s.text, 0.5), fontFamily: s.font }}>
              {labels?.rsvpDeadline || t("event.rsvpDeadline")} {new Date(rsvpDeadline).toLocaleDateString(lang === "en" ? "en-US" : "de-AT")}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder={labels?.name || t("event.name")} value={name} onChange={(e) => { setName(e.target.value); setSharedName(e.target.value); setNameEditedLocally(true); }} required style={inputStyle} />
          <input type="email" placeholder={labels?.email || t("event.email")} value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

          {/* Attendance buttons */}
          <div className="flex gap-3">
            {(["accepted", "declined"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setAttendance(status)}
                className="flex-1 py-3.5 px-4 text-sm font-medium transition-all"
                style={{
                  borderRadius: s.radius,
                  fontFamily: s.font,
                  ...(attendance === status
                    ? { backgroundColor: s.accent, color: "#fff", border: `1px solid ${s.accent}` }
                    : { backgroundColor: "transparent", color: colorWithAlpha(s.text, 0.6), border: `1px solid ${s.inputBorder}` }),
                }}
              >
                {status === "accepted" ? (labels?.attending || t("event.attending")) : (labels?.notAttending || t("event.notAttending"))}
              </button>
            ))}
          </div>

          {attendance === "accepted" && (
            <>
              <div>
                <label className="block text-sm mb-2" style={{ color: colorWithAlpha(s.text, 0.6), fontFamily: s.font }}>
                  {companionLabel} {maxCompanions > 0 && <span style={{ opacity: 0.5 }}>(max. {maxCompanions})</span>}
                </label>
                <input type="number" min={0} max={maxCompanions} value={companionCount} onChange={(e) => handleCompanionCountChange(parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: 100 }} />
              </div>
              {companionCount > 0 && (
                <div className="space-y-3">
                  {Array.from({ length: companionCount }).map((_, i) => (
                    <input key={i} type="text" placeholder={`${labels?.companionName || t("event.companionName") || "Name Begleitperson"} ${i + 1}`} value={companionNames[i] || ""} onChange={(e) => { const u = [...companionNames]; u[i] = e.target.value; setCompanionNames(u); }} style={inputStyle} />
                  ))}
                </div>
              )}
              {menuSelection && (
                <div>
                  <label className="block text-sm mb-2" style={{ color: colorWithAlpha(s.text, 0.6), fontFamily: s.font }}>
                    {labels?.menuChoice || t("event.menuChoice")}
                  </label>
                  <select value={menuChoice} onChange={(e) => setMenuChoice(e.target.value)} style={inputStyle}>
                    <option value="">{labels?.standard || t("event.dietary.standard")}</option>
                    <option value="vegetarian">{labels?.vegetarian || t("event.dietary.vegetarian")}</option>
                    <option value="vegan">{labels?.vegan || t("event.dietary.vegan")}</option>
                    <option value="glutenfree">{labels?.glutenfree || t("event.dietary.glutenfree")}</option>
                    <option value="lactosefree">{labels?.lactosefree || t("event.dietary.lactosefree")}</option>
                  </select>
                </div>
              )}
            </>
          )}

          <textarea placeholder={labels?.message || t("event.message")} value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />

          <button
            type="submit"
            disabled={submitRsvp.isPending}
            className="w-full py-4 text-sm font-medium tracking-[0.1em] uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: s.accent,
              color: "#fff",
              borderRadius: s.radius,
              fontFamily: s.font,
              border: "none",
            }}
          >
            {submitRsvp.isPending ? "..." : (labels?.submit || t("event.submit"))}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RsvpForm;
