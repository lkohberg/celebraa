
-- =============================================
-- FIX 1: Create public view for live events
-- =============================================

-- Create a view that only exposes non-sensitive fields for public event pages
CREATE VIEW public.events_public
WITH (security_invoker = on) AS
SELECT
  id,
  title,
  description,
  event_date,
  event_time,
  event_link,
  location_name,
  address,
  template_id,
  tier,
  font,
  primary_color,
  hero_image_url,
  selected_blocks,
  block_config,
  rsvp_enabled,
  rsvp_deadline,
  menu_selection,
  max_guests,
  dress_code,
  children_welcome,
  hotel_recommendations,
  schedule,
  story_text,
  ceremony_location,
  ceremony_address,
  reception_location,
  reception_address,
  languages,
  status
FROM public.events
WHERE status = 'live';

-- Drop the old open policy on events for public viewing
DROP POLICY IF EXISTS "Anyone can view live events" ON public.events;

-- Add a restrictive policy that denies anon direct SELECT (only authenticated owners/admins)
-- Keep existing owner and admin SELECT policies, they still work

-- =============================================
-- FIX 2: Payment bypass - restrict status updates
-- =============================================

-- Drop and recreate the user update policy with WITH CHECK
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('draft', 'archived')
  );

-- Restrict INSERT to only allow draft status
DROP POLICY IF EXISTS "Users can create their own events" ON public.events;
CREATE POLICY "Users can create their own events" ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'draft');

-- =============================================
-- FIX 3: Guest update policy - remove open USING(true)
-- =============================================

DROP POLICY IF EXISTS "Guests can update their RSVP" ON public.guests;

-- Only event owners can update guest records
CREATE POLICY "Event owners can update guests" ON public.guests
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM events
    WHERE events.id = guests.event_id
    AND events.user_id = auth.uid()
  ));
