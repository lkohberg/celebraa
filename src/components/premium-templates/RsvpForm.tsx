import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Check, Send, PartyPopper, CalendarCheck } from "lucide-react";
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
  const { guestName: sharedName, setGuestName: setSharedName } = useGuestName();
  const [name, setName] = useState(sharedName || "");
  const [nameEditedLocally, setNameEditedLocally] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sharedName && !nameEditedLocally) {
      setName(sharedName);
    }
  }, [sharedName]);

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
      setSubmitted(true);
    } catch {
      toast.error(t("event.rsvpError"));
    }
  };

  const companionLabel = labels?.companions || t("event.companions") || "Begleitpersonen";

  return (
    <section className="py-10 md:py-24 relative overflow-hidden" style={{ backgroundColor: "hsl(30, 33%, 96%)" }}>
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `radial-gradient(${primaryColor} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />

      <div className="relative max-w-lg mx-auto px-4">
        {/* Card container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg p-4 sm:p-7 md:p-10"
        >
          <div className="text-center mb-5 md:mb-10">
            {variant === "wedding" ? (
              <Heart className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2.5" style={{ color: primaryColor }} />
            ) : variant === "birthday" ? (
              <PartyPopper className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2.5" style={{ color: primaryColor }} />
            ) : (
              <CalendarCheck className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2.5" style={{ color: primaryColor }} />
            )}
            <h2 className="font-display text-lg md:text-3xl text-foreground mb-1.5">
              {variant === "corporate" ? (labels?.register || t("event.register")) : (labels?.rsvp || t("event.rsvp"))}
            </h2>
            <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: primaryColor, opacity: 0.4 }} />
            {rsvpDeadline && (
              <p className="font-body text-xs text-muted-foreground">
                {labels?.rsvpDeadline || t("event.rsvpDeadline")} {new Date(rsvpDeadline).toLocaleDateString(lang === "en" ? "en-US" : "de-AT")}
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                  className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor + "1a" }}
                >
                  <Check className="w-7 h-7" style={{ color: primaryColor }} />
                </motion.div>
                <h3 className="font-display text-lg text-foreground mb-2">{labels?.thankYou || t("event.thankYou")}</h3>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "4rem" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-px mx-auto mt-4"
                  style={{ backgroundColor: primaryColor, opacity: 0.3 }}
                />
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    id="rsvp-name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setSharedName(e.target.value); setNameEditedLocally(true); }}
                    required
                    placeholder=" "
                    className="peer w-full px-3.5 pt-5 pb-2 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <label htmlFor="rsvp-name" className="absolute left-3.5 top-1 text-[9px] font-body tracking-wider uppercase text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:tracking-wider pointer-events-none">
                    {labels?.name || t("event.name")}
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    id="rsvp-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full px-3.5 pt-5 pb-2 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <label htmlFor="rsvp-email" className="absolute left-3.5 top-1 text-[9px] font-body tracking-wider uppercase text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:tracking-wider pointer-events-none">
                    {labels?.email || t("event.email")}
                  </label>
                </div>

                {/* Attendance buttons */}
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance("accepted")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 font-body text-xs rounded-xl border-2 transition-all duration-300"
                    style={
                      attendance === "accepted"
                        ? { backgroundColor: primaryColor, color: "white", borderColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}33` }
                        : { backgroundColor: "transparent", borderColor: "hsl(30, 20%, 88%)", color: "hsl(30, 10%, 45%)" }
                    }
                  >
                    {variant === "wedding" ? (
                      <Heart className="w-3.5 h-3.5" fill={attendance === "accepted" ? "white" : "none"} />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    {labels?.attending || t("event.attending")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("declined")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 font-body text-xs rounded-xl border-2 transition-all duration-300"
                    style={
                      attendance === "declined"
                        ? { backgroundColor: "hsl(0, 0%, 45%)", color: "white", borderColor: "hsl(0, 0%, 45%)" }
                        : { backgroundColor: "transparent", borderColor: "hsl(30, 20%, 88%)", color: "hsl(30, 10%, 45%)" }
                    }
                  >
                    <X className="w-3.5 h-3.5" />
                    {labels?.notAttending || t("event.notAttending")}
                  </button>
                </div>

                <AnimatePresence>
                  {attendance === "accepted" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-3"
                    >
                      {/* Companion count */}
                      <div>
                        <label className="block font-body text-[9px] tracking-wider uppercase text-muted-foreground mb-1.5">
                          {companionLabel} {maxCompanions > 0 && <span className="opacity-60">(max. {maxCompanions})</span>}
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={maxCompanions}
                          value={companionCount}
                          onChange={(e) => handleCompanionCountChange(parseInt(e.target.value) || 0)}
                          className="w-20 px-3 pt-2.5 pb-2 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {companionCount > 0 && (
                        <div className="space-y-2.5">
                          {Array.from({ length: companionCount }).map((_, i) => (
                            <div key={i} className="relative">
                              <input
                                type="text"
                                id={`companion-${i}`}
                                placeholder=" "
                                value={companionNames[i] || ""}
                                onChange={(e) => {
                                  const updated = [...companionNames];
                                  updated[i] = e.target.value;
                                  setCompanionNames(updated);
                                }}
                                className="peer w-full px-3.5 pt-5 pb-2 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                              />
                              <label htmlFor={`companion-${i}`} className="absolute left-3.5 top-1 text-[9px] font-body tracking-wider uppercase text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:tracking-wider pointer-events-none">
                                {`${labels?.companionName || t("event.companionName") || "Begleitperson"} ${i + 1}`}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {menuSelection && (
                        <div>
                          <label className="block font-body text-[9px] tracking-wider uppercase text-muted-foreground mb-1.5">
                            {labels?.menuChoice || t("event.menuChoice")}
                          </label>
                          <select
                            value={menuChoice}
                            onChange={(e) => setMenuChoice(e.target.value)}
                            className="w-full px-3.5 py-2.5 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="">{labels?.standard || t("event.dietary.standard")}</option>
                            <option value="vegetarian">{labels?.vegetarian || t("event.dietary.vegetarian")}</option>
                            <option value="vegan">{labels?.vegan || t("event.dietary.vegan")}</option>
                            <option value="glutenfree">{labels?.glutenfree || t("event.dietary.glutenfree")}</option>
                            <option value="lactosefree">{labels?.lactosefree || t("event.dietary.lactosefree")}</option>
                          </select>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message */}
                <div className="relative">
                  <textarea
                    id="rsvp-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    placeholder=" "
                    className="peer w-full px-3.5 pt-5 pb-2 font-body text-sm bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors resize-y min-h-[60px]"
                  />
                  <label htmlFor="rsvp-message" className="absolute left-3.5 top-1 text-[9px] font-body tracking-wider uppercase text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:text-[9px] peer-focus:tracking-wider pointer-events-none">
                    {labels?.message || t("event.message")}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitRsvp.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 font-body text-xs tracking-[0.15em] uppercase text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}22` }}
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitRsvp.isPending ? "..." : (labels?.submit || t("event.submit"))}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default RsvpForm;
