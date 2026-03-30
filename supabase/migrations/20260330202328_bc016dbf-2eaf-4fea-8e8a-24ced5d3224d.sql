
-- Create a SECURITY DEFINER function to check if an event is live
-- This bypasses RLS so anon policies on related tables can still verify event status
CREATE OR REPLACE FUNCTION public.is_event_live(_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events
    WHERE id = _event_id AND status = 'live'
  )
$$;

-- Also one for RSVP check (live + rsvp_enabled)
CREATE OR REPLACE FUNCTION public.is_event_rsvp_open(_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events
    WHERE id = _event_id AND status = 'live' AND rsvp_enabled = true
  )
$$;

-- Now update all 9 policies to use the helper functions instead of direct subqueries

-- game_votes SELECT
DROP POLICY "Anyone can view game votes for live events" ON public.game_votes;
CREATE POLICY "Anyone can view game votes for live events"
ON public.game_votes FOR SELECT TO public
USING (public.is_event_live(event_id));

-- game_votes INSERT
DROP POLICY "Anyone can vote on games for live events" ON public.game_votes;
CREATE POLICY "Anyone can vote on games for live events"
ON public.game_votes FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));

-- guest_photos SELECT
DROP POLICY "Anyone can view photos of live events" ON public.guest_photos;
CREATE POLICY "Anyone can view photos of live events"
ON public.guest_photos FOR SELECT TO public
USING (public.is_event_live(event_id));

-- guest_photos INSERT
DROP POLICY "Anyone can upload photos to live events" ON public.guest_photos;
CREATE POLICY "Anyone can upload photos to live events"
ON public.guest_photos FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));

-- guests INSERT (RSVP)
DROP POLICY "Anyone can RSVP to live events" ON public.guests;
CREATE POLICY "Anyone can RSVP to live events"
ON public.guests FOR INSERT TO public
WITH CHECK (public.is_event_rsvp_open(event_id));

-- music_wishes INSERT
DROP POLICY "Anyone can submit music wishes to live events" ON public.music_wishes;
CREATE POLICY "Anyone can submit music wishes to live events"
ON public.music_wishes FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));

-- potluck_claims SELECT
DROP POLICY "Anyone can view potluck claims for live events" ON public.potluck_claims;
CREATE POLICY "Anyone can view potluck claims for live events"
ON public.potluck_claims FOR SELECT TO public
USING (public.is_event_live(event_id));

-- potluck_claims INSERT
DROP POLICY "Anyone can claim potluck items on live events" ON public.potluck_claims;
CREATE POLICY "Anyone can claim potluck items on live events"
ON public.potluck_claims FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));

-- quiz_responses INSERT
DROP POLICY "Anyone can submit quiz responses to live events" ON public.quiz_responses;
CREATE POLICY "Anyone can submit quiz responses to live events"
ON public.quiz_responses FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));

-- Also fix the analytics insert policy while we're at it (currently WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.event_analytics;
CREATE POLICY "Anyone can insert analytics for live events"
ON public.event_analytics FOR INSERT TO public
WITH CHECK (public.is_event_live(event_id));
