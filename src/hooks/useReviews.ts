import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMyReview = (userId?: string) =>
  useQuery({
    queryKey: ["my-review", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews" as any)
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; rating: number; feedback: string | null; created_at: string } | null;
    },
    enabled: !!userId,
  });

export const useAllReviews = (isAdmin: boolean) =>
  useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as { id: string; user_id: string; rating: number; feedback: string | null; created_at: string }[];
    },
    enabled: isAdmin,
  });

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, rating, feedback }: { userId: string; rating: number; feedback?: string }) => {
      const { data, error } = await supabase
        .from("reviews" as any)
        .upsert({ user_id: userId, rating, feedback: feedback || null } as any, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-review"] });
      qc.invalidateQueries({ queryKey: ["all-reviews"] });
    },
  });
};
