
-- Admin can view all events (for dashboard management)
CREATE POLICY "Admin can view all events"
ON public.events FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@celebra.at');

-- Admin can update all events (to set status, etc.)
CREATE POLICY "Admin can update all events"
ON public.events FOR UPDATE
USING (auth.jwt() ->> 'email' = 'admin@celebra.at');

-- Admin can view all guests
CREATE POLICY "Admin can view all guests"
ON public.guests FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@celebra.at');

-- Admin can view all music wishes
CREATE POLICY "Admin can view all music wishes"
ON public.music_wishes FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@celebra.at');

-- Admin can view all analytics
CREATE POLICY "Admin can view all analytics"
ON public.event_analytics FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@celebra.at');
