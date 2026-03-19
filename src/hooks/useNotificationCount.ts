import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "celebra_last_dashboard_visit";

export const getLastDashboardVisit = (): string => {
  return localStorage.getItem(STORAGE_KEY) || new Date(0).toISOString();
};

export const markDashboardVisited = () => {
  localStorage.setItem(STORAGE_KEY, new Date().toISOString());
};

export const useNotificationCount = (userId?: string) =>
  useQuery({
    queryKey: ["notification-count", userId],
    queryFn: async () => {
      const since = getLastDashboardVisit();

      // Get user's event IDs
      const { data: events } = await supabase
        .from("events")
        .select("id")
        .eq("user_id", userId!);

      if (!events?.length) return 0;
      const eventIds = events.map((e) => e.id);

      // Count new guests
      const { count: guestCount } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .gt("created_at", since);

      // Count new music wishes
      const { count: musicCount } = await supabase
        .from("music_wishes")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .gt("created_at", since);

      // Count new potluck claims
      const { count: potluckCount } = await supabase
        .from("potluck_claims")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .gt("created_at", since);

      // Count new quiz responses
      const { count: quizCount } = await supabase
        .from("quiz_responses")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .gt("created_at", since);

      // Count new game votes
      const { count: gameCount } = await supabase
        .from("game_votes")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .gt("created_at", since);

      return (guestCount || 0) + (musicCount || 0) + (potluckCount || 0) + (quizCount || 0) + (gameCount || 0);
    },
    enabled: !!userId,
    refetchInterval: 60000, // refresh every minute
    staleTime: 30000,
  });
