
-- 1. Remove the public SELECT policy from the base events table
DROP POLICY IF EXISTS "Anyone can view live events" ON public.events;

-- 2. Recreate the events_public view as SECURITY DEFINER so it bypasses RLS
DROP VIEW IF EXISTS public.events_public;

CREATE VIEW public.events_public
WITH (security_invoker = false)
AS
SELECT id, title, description, event_date, event_time,
       event_link, location_name, address, template_id, tier,
       font, primary_color, hero_image_url, selected_blocks,
       block_config, rsvp_enabled, rsvp_deadline, menu_selection,
       max_guests, dress_code, children_welcome,
       hotel_recommendations, schedule, story_text,
       ceremony_location, ceremony_address,
       reception_location, reception_address, languages, status
FROM public.events
WHERE status = 'live';

-- 3. Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.events_public TO anon, authenticated;
