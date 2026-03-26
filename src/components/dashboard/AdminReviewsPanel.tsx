import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAllReviews } from "@/hooks/useReviews";
import { useTranslation } from "@/i18n";

const AdminReviewsPanel = () => {
  const { t } = useTranslation();
  const { data: reviews } = useAllReviews(true);
  const [open, setOpen] = useState(false);

  const avgRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "–";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-body gap-2">
          <MessageSquare className="w-4 h-4" />
          {t("review.adminButton")} ({reviews?.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-3">
            {t("review.adminTitle")}
            <span className="font-body text-sm text-muted-foreground">
              ⌀ {avgRating} ⭐ · {reviews?.length || 0} {t("review.reviewsCount")}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {!reviews?.length ? (
            <p className="font-body text-sm text-muted-foreground">{t("review.noReviews")}</p>
          ) : (
            reviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3.5 h-3.5"
                          fill={s <= r.rating ? "hsl(43, 70%, 50%)" : "transparent"}
                          stroke={s <= r.rating ? "hsl(43, 70%, 50%)" : "hsl(var(--muted-foreground))"}
                        />
                      ))}
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("de-AT")}
                    </span>
                  </div>
                  {r.feedback && (
                    <p className="font-body text-sm text-foreground mt-1">"{r.feedback}"</p>
                  )}
                  <p className="font-body text-[10px] text-muted-foreground/60 mt-1 truncate">
                    {r.user_id.slice(0, 8)}…
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminReviewsPanel;
