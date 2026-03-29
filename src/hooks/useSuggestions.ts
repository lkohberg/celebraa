import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMySuggestion = (userId?: string) =>
  useQuery({
    queryKey: ["my-suggestion", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggestions" as any)
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as { id: string; message: string; created_at: string } | null;
    },
    enabled: !!userId,
  });

export const useAllSuggestions = (isAdmin: boolean) =>
  useQuery({
    queryKey: ["all-suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggestions" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as { id: string; user_id: string; message: string; created_at: string }[];
    },
    enabled: isAdmin,
  });

export const useSubmitSuggestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const { data, error } = await supabase
        .from("suggestions" as any)
        .upsert({ user_id: userId, message } as any, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-suggestion"] });
      qc.invalidateQueries({ queryKey: ["all-suggestions"] });
    },
  });
};
