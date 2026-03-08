
-- Add block_config column for storing block-specific configuration
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS block_config jsonb DEFAULT '{}'::jsonb;

-- Create music_wishes table
CREATE TABLE public.music_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  song_title text NOT NULL,
  artist text,
  guest_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.music_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit music wishes to live events"
ON public.music_wishes FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = music_wishes.event_id
  AND events.status = 'live'
));

CREATE POLICY "Event owners can view music wishes"
ON public.music_wishes FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = music_wishes.event_id
  AND events.user_id = auth.uid()
));

-- Fix guest UPDATE RLS - remove overly permissive policy
DROP POLICY IF EXISTS "Guests can update their RSVP by event" ON public.guests;
