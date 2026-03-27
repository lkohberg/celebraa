import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMyReview, useSubmitReview } from "@/hooks/useReviews";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";

const ReviewForm = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { data: existingReview } = useMyReview(userId);
  const submitReview = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [editing, setEditing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const hasReview = !!existingReview;

  const handleStarClick = (s: number) => {
    setRating(s);
    if (!hasReview || editing) {
      setShowFeedback(true);
    }
  };

  const handleSubmit = () => {
    if (rating < 1) return;
    submitReview.mutate(
      { userId, rating, feedback: feedback.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(t("review.submitted"));
          setEditing(false);
          setShowFeedback(false);
        },
        onError: () => toast.error(t("review.error")),
      }
    );
  };

  // Compact display when review exists and not editing
  if (hasReview && !editing) {
    return (
      <div className="flex items-center gap-3 py-3 border-t border-border mt-6">
        <span className="font-body text-xs text-muted-foreground">{t("review.yourReview")}:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="w-3.5 h-3.5"
              fill={s <= existingReview.rating ? "hsl(43, 70%, 50%)" : "transparent"}
              stroke={s <= existingReview.rating ? "hsl(43, 70%, 50%)" : "hsl(var(--muted-foreground))"}
            />
          ))}
        </div>
        {existingReview.feedback && (
          <span className="font-body text-xs text-muted-foreground italic truncate max-w-[200px]">"{existingReview.feedback}"</span>
        )}
        <button className="font-body text-xs text-primary underline ml-auto" onClick={() => {
          setRating(existingReview.rating);
          setFeedback(existingReview.feedback || "");
          setEditing(true);
          setShowFeedback(true);
        }}>
          {t("review.edit")}
        </button>
      </div>
    );
  }

  return (
    <div className="py-3 border-t border-border mt-6 space-y-2">
      <div className="flex items-center gap-3">
        <span className="font-body text-xs text-muted-foreground">{t("review.rateUs")}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleStarClick(s)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className="w-5 h-5"
                fill={s <= (hover || rating) ? "hsl(43, 70%, 50%)" : "transparent"}
                stroke={s <= (hover || rating) ? "hsl(43, 70%, 50%)" : "hsl(var(--muted-foreground))"}
              />
            </button>
          ))}
        </div>
        {editing && (
          <button className="font-body text-xs text-muted-foreground underline ml-auto" onClick={() => { setEditing(false); setShowFeedback(false); }}>
            {t("review.cancel")}
          </button>
        )}
      </div>
      {showFeedback && rating > 0 && (
        <div className="flex gap-2 items-end">
          <Textarea
            placeholder={t("review.feedbackPlaceholder")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={1}
            className="font-body text-xs resize-none flex-1"
            maxLength={500}
          />
          <Button size="sm" className="font-body text-xs h-8" disabled={submitReview.isPending} onClick={handleSubmit}>
            {submitReview.isPending ? "..." : t("review.submit")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
