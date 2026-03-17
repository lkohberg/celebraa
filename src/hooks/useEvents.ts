import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type PublicEvent = Tables<"events">;

export const useMyEvents = (userId?: string, isAdmin?: boolean) =>
  useQuery({
    queryKey: ["my-events", userId, !!isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (!isAdmin && userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

export const useEventByLink = (eventLink: string) =>
  useQuery({
    queryKey: ["event", eventLink],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events_public" as any)
        .select("*")
        .eq("event_link", eventLink)
        .single();
      if (error) throw error;
      return data as unknown as PublicEvent;
    },
    enabled: !!eventLink,
  });

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: TablesInsert<"events">) => {
      const { data, error } = await supabase.from("events").insert(event).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-events"] }),
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TablesInsert<"events">>) => {
      const { data, error } = await supabase.from("events").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-events"] }),
  });
};

export const useEventGuests = (eventId: string) =>
  useQuery({
    queryKey: ["guests", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

export const useEventAnalytics = (eventId: string) =>
  useQuery({
    queryKey: ["analytics", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_analytics")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

export const useTrackAnalytics = () =>
  useMutation({
    mutationFn: async (entry: { event_id: string; event_type: string; referrer?: string }) => {
      const { error } = await supabase.from("event_analytics").insert({
        event_id: entry.event_id,
        event_type: entry.event_type,
        referrer: entry.referrer || null,
        user_agent: navigator.userAgent,
      });
      if (error) throw error;
    },
  });

export const useSubmitRsvp = () =>
  useMutation({
    mutationFn: async (guest: {
      event_id: string;
      name: string;
      email?: string;
      rsvp_status: string;
      plus_one?: boolean;
      companion_count?: number;
      companion_names?: string[];
      menu_choice?: string;
      message?: string;
    }) => {
      const { companion_count, companion_names, ...rest } = guest;
      const { data, error } = await supabase.from("guests").insert({
        ...rest,
        responded_at: new Date().toISOString(),
        companion_count: companion_count || 0,
        companion_names: companion_names || [],
      } as any).select().single();
      if (error) throw error;
      return data;
    },
  });

export const useCheckEventLink = () =>
  useMutation({
    mutationFn: async (link: string) => {
      const { data } = await supabase
        .from("events")
        .select("id")
        .eq("event_link", link)
        .maybeSingle();
      return { available: !data };
    },
  });

// Music wishes
export const useMusicWishes = (eventId: string) =>
  useQuery({
    queryKey: ["music-wishes", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("music_wishes")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

export const useSubmitMusicWish = () =>
  useMutation({
    mutationFn: async (wish: { event_id: string; song_title: string; artist?: string; guest_name?: string }) => {
      const { data, error } = await supabase
        .from("music_wishes")
        .insert(wish)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });

// Potluck claims
export const usePotluckClaims = (eventId: string) =>
  useQuery({
    queryKey: ["potluck-claims", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("potluck_claims" as any)
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!eventId,
  });

export const useClaimPotluckItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (claim: { event_id: string; item_name: string; claimed_by: string }) => {
      const { data, error } = await supabase
        .from("potluck_claims" as any)
        .insert(claim)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["potluck-claims", variables.event_id] });
    },
  });
};

// Quiz responses
export const useQuizResponses = (eventId: string) =>
  useQuery({
    queryKey: ["quiz-responses", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_responses" as any)
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!eventId,
  });

export const useSubmitQuizResponse = () =>
  useMutation({
    mutationFn: async (response: { event_id: string; question_index: number; selected_option: number; guest_name?: string }) => {
      const { data, error } = await supabase
        .from("quiz_responses" as any)
        .insert(response)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });

// Game votes
export const useGameVotes = (eventId: string) =>
  useQuery({
    queryKey: ["game-votes", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_votes" as any)
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!eventId,
  });

export const useSubmitGameVote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vote: { event_id: string; game_name: string; guest_name?: string }) => {
      const { data, error } = await supabase
        .from("game_votes" as any)
        .insert(vote)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["game-votes", variables.event_id] });
    },
  });
};
