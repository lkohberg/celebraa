import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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

  const hasReview = !!existingReview;
  const showForm = !hasReview || editing;

  const handleSubmit = () => {
    if (rating < 1) return;
    submitReview.mutate(
      { userId, rating, feedback: feedback.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(t("review.submitted"));
          setEditing(false);
        },
        onError: () => toast.error(t("review.error")),
      }
    );
  };

  if (hasReview && !editing) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-body text-sm text-muted-foreground">{t("review.yourReview")}:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4"
                    fill={s <= existingReview.rating ? "hsl(43, 70%, 50%)" : "transparent"}
                    stroke={s <= existingReview.rating ? "hsl(43, 70%, 50%)" : "hsl(var(--muted-foreground))"}
                  />
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="font-body text-xs" onClick={() => {
              setRating(existingReview.rating);
              setFeedback(existingReview.feedback || "");
              setEditing(true);
            }}>
              {t("review.edit")}
            </Button>
          </div>
          {existingReview.feedback && (
            <p className="font-body text-sm text-muted-foreground mt-2 italic">"{existingReview.feedback}"</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!showForm) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-3">
        <p className="font-body text-sm font-medium text-foreground">{t("review.rateUs")}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className="w-7 h-7"
                fill={s <= (hover || rating) ? "hsl(43, 70%, 50%)" : "transparent"}
                stroke={s <= (hover || rating) ? "hsl(43, 70%, 50%)" : "hsl(var(--muted-foreground))"}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder={t("review.feedbackPlaceholder")}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={2}
          className="font-body text-sm resize-none"
          maxLength={500}
        />
        <div className="flex gap-2">
          <Button size="sm" className="font-body" disabled={rating < 1 || submitReview.isPending} onClick={handleSubmit}>
            {submitReview.isPending ? "..." : t("review.submit")}
          </Button>
          {editing && (
            <Button size="sm" variant="ghost" className="font-body" onClick={() => setEditing(false)}>
              {t("review.cancel")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
