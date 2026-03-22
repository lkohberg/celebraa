import { useState, useEffect } from "react";
import { useSubmitRsvp } from "@/hooks/useEvents";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import { type EventLang, getEventLabels } from "@/i18n/eventLabels";
import { useGuestName } from "@/hooks/useGuestName";

interface RsvpFormProps {
  eventId: string;
  rsvpDeadline?: string | null;
  menuSelection?: boolean;
  variant?: "wedding" | "birthday" | "corporate";
  lang?: EventLang;
  maxCompanions?: number;
}

const RsvpForm = ({ eventId, rsvpDeadline, menuSelection, variant = "wedding", lang, maxCompanions = 5 }: RsvpFormProps) => {
  const { t } = useTranslation();
  const labels = lang ? getEventLabels(lang) : null;
  const submitRsvp = useSubmitRsvp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"accepted" | "declined" | null>(null);
  const [companionCount, setCompanionCount] = useState(0);
  const [companionNames, setCompanionNames] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [menuChoice, setMenuChoice] = useState("");

  const primaryColor = variant === "wedding"
    ? "hsl(150, 18%, 38%)"
    : variant === "birthday"
    ? "hsl(340, 65%, 50%)"
    : "hsl(220, 50%, 35%)";

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
      setName("");
      setEmail("");
      setAttendance(null);
      setCompanionCount(0);
      setCompanionNames([]);
      setMessage("");
      setMenuChoice("");
    } catch {
      toast.error(t("event.rsvpError"));
    }
  };

  const inputClass =
    "w-full px-4 py-3 font-body text-base bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-primary transition-colors";

  const companionLabel = labels?.companions || t("event.companions") || "Begleitpersonen";

  return (
    <section className="py-24" style={{ backgroundColor: "hsl(30, 33%, 96%)" }}>
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
            {variant === "corporate" ? (labels?.register || t("event.register")) : (labels?.rsvp || t("event.rsvp"))}
          </h2>
          <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: primaryColor }} />
          {rsvpDeadline && (
            <p className="font-body text-muted-foreground">
              {labels?.rsvpDeadline || t("event.rsvpDeadline")} {new Date(rsvpDeadline).toLocaleDateString(lang === "en" ? "en-US" : "de-AT")}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder={labels?.name || t("event.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="email"
            placeholder={labels?.email || t("event.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          {/* Attendance buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAttendance("accepted")}
              className="flex-1 py-3 px-4 font-body text-sm rounded-md border transition-all"
              style={
                attendance === "accepted"
                  ? { backgroundColor: primaryColor, color: "white", borderColor: primaryColor }
                  : { backgroundColor: "hsl(30, 30%, 98%)", borderColor: "hsl(30, 20%, 88%)" }
              }
            >
              {labels?.attending || t("event.attending")}
            </button>
            <button
              type="button"
              onClick={() => setAttendance("declined")}
              className="flex-1 py-3 px-4 font-body text-sm rounded-md border transition-all"
              style={
                attendance === "declined"
                  ? { backgroundColor: primaryColor, color: "white", borderColor: primaryColor }
                  : { backgroundColor: "hsl(30, 30%, 98%)", borderColor: "hsl(30, 20%, 88%)" }
              }
            >
              {labels?.notAttending || t("event.notAttending")}
            </button>
          </div>

          {attendance === "accepted" && (
            <>
              {/* Companion count */}
              <div>
                <label className="block font-body text-sm text-foreground mb-2">
                  {companionLabel} {maxCompanions > 0 && <span className="text-muted-foreground">(max. {maxCompanions})</span>}
                </label>
                <input
                  type="number"
                  min={0}
                  max={maxCompanions}
                  value={companionCount}
                  onChange={(e) => handleCompanionCountChange(parseInt(e.target.value) || 0)}
                  className={inputClass + " w-24"}
                />
              </div>

              {/* Companion name fields */}
              {companionCount > 0 && (
                <div className="space-y-3">
                  {Array.from({ length: companionCount }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`${labels?.companionName || t("event.companionName") || "Name Begleitperson"} ${i + 1}`}
                      value={companionNames[i] || ""}
                      onChange={(e) => {
                        const updated = [...companionNames];
                        updated[i] = e.target.value;
                        setCompanionNames(updated);
                      }}
                      className={inputClass}
                    />
                  ))}
                </div>
              )}

              {menuSelection && (
                <div>
                  <label className="block font-body text-sm text-foreground mb-2">
                    {labels?.menuChoice || t("event.menuChoice")}
                  </label>
                  <select
                    value={menuChoice}
                    onChange={(e) => setMenuChoice(e.target.value)}
                    className={inputClass}
                  >
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

          <textarea
            placeholder={labels?.message || t("event.message")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className={inputClass + " resize-y min-h-[80px]"}
          />

          <button
            type="submit"
            disabled={submitRsvp.isPending}
            className="w-full py-4 font-body text-sm tracking-[0.15em] uppercase text-white rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {submitRsvp.isPending ? "..." : (labels?.submit || t("event.submit"))}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RsvpForm;
