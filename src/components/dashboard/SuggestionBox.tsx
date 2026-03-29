import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMySuggestion, useSubmitSuggestion } from "@/hooks/useSuggestions";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";

const SuggestionBox = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { data: existing } = useMySuggestion(userId);
  const submitSuggestion = useSubmitSuggestion();
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const hasSuggestion = !!existing;

  const handleSubmit = () => {
    if (!message.trim()) return;
    submitSuggestion.mutate(
      { userId, message: message.trim() },
      {
        onSuccess: () => {
          toast.success(t("suggestion.submitted"));
          setEditing(false);
        },
        onError: () => toast.error(t("suggestion.error")),
      }
    );
  };

  if (hasSuggestion && !editing) {
    return (
      <div className="flex items-start gap-3 py-3 border-t border-border mt-6">
        <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-body text-xs text-muted-foreground">{t("suggestion.yourSuggestion")}:</span>
          <p className="font-body text-xs text-foreground italic truncate">"{existing.message}"</p>
        </div>
        <button className="font-body text-xs text-primary underline shrink-0" onClick={() => {
          setMessage(existing.message);
          setEditing(true);
        }}>
          {t("review.edit")}
        </button>
      </div>
    );
  }

  return (
    <div className="py-3 border-t border-border mt-6 space-y-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <span className="font-body text-xs text-muted-foreground">{t("suggestion.title")}</span>
      </div>
      <div className="flex gap-2 items-end">
        <Textarea
          placeholder={t("suggestion.placeholder")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="font-body text-xs resize-none flex-1"
          maxLength={1000}
        />
        <Button size="sm" className="font-body text-xs h-8 gap-1" disabled={submitSuggestion.isPending || !message.trim()} onClick={handleSubmit}>
          <Send className="w-3 h-3" />
          {submitSuggestion.isPending ? "..." : t("suggestion.send")}
        </Button>
      </div>
      {editing && (
        <button className="font-body text-xs text-muted-foreground underline" onClick={() => { setEditing(false); setMessage(""); }}>
          {t("review.cancel")}
        </button>
      )}
    </div>
  );
};

export default SuggestionBox;
