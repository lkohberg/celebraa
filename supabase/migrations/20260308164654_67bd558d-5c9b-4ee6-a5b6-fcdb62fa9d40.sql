
-- Update RLS policies to use has_role() instead of email check

-- event_analytics: Admin can view all analytics
DROP POLICY IF EXISTS "Admin can view all analytics" ON public.event_analytics;
CREATE POLICY "Admin can view all analytics" ON public.event_analytics
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- events: Admin can view all events
DROP POLICY IF EXISTS "Admin can view all events" ON public.events;
CREATE POLICY "Admin can view all events" ON public.events
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- events: Admin can update all events
DROP POLICY IF EXISTS "Admin can update all events" ON public.events;
CREATE POLICY "Admin can update all events" ON public.events
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- guests: Admin can view all guests
DROP POLICY IF EXISTS "Admin can view all guests" ON public.guests;
CREATE POLICY "Admin can view all guests" ON public.guests
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- music_wishes: Admin can view all music wishes
DROP POLICY IF EXISTS "Admin can view all music wishes" ON public.music_wishes;
CREATE POLICY "Admin can view all music wishes" ON public.music_wishes
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
