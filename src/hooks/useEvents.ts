import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type PublicEvent = Tables<"events">;

export const useMyEvents = () =>
  useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
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
      return data;
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
    mutationFn: async (guest: { event_id: string; name: string; email?: string; rsvp_status: string; plus_one?: boolean; menu_choice?: string; message?: string }) => {
      const { data, error } = await supabase.from("guests").insert({
        ...guest,
        responded_at: new Date().toISOString(),
      }).select().single();
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
        .from("music_wishes" as any)
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!eventId,
  });

export const useSubmitMusicWish = () =>
  useMutation({
    mutationFn: async (wish: { event_id: string; song_title: string; artist?: string; guest_name?: string }) => {
      const { data, error } = await supabase
        .from("music_wishes" as any)
        .insert(wish)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
