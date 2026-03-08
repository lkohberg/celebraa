
-- Fix: Change all SELECT policies from RESTRICTIVE to PERMISSIVE (OR logic)

-- ===== EVENTS =====
DROP POLICY IF EXISTS "Admin can view all events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view live events" ON public.events;
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;

CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all events" ON public.events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view live events" ON public.events
  FOR SELECT USING (status = 'live'::text);

-- ===== GUESTS =====
DROP POLICY IF EXISTS "Admin can view all guests" ON public.guests;
DROP POLICY IF EXISTS "Event owners can view guests" ON public.guests;

CREATE POLICY "Event owners can view guests" ON public.guests
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Admin can view all guests" ON public.guests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ===== MUSIC_WISHES =====
DROP POLICY IF EXISTS "Admin can view all music wishes" ON public.music_wishes;
DROP POLICY IF EXISTS "Event owners can view music wishes" ON public.music_wishes;

CREATE POLICY "Event owners can view music wishes" ON public.music_wishes
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = music_wishes.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Admin can view all music wishes" ON public.music_wishes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ===== EVENT_ANALYTICS =====
DROP POLICY IF EXISTS "Admin can view all analytics" ON public.event_analytics;
DROP POLICY IF EXISTS "Event owners can view analytics" ON public.event_analytics;

CREATE POLICY "Event owners can view analytics" ON public.event_analytics
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = event_analytics.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Admin can view all analytics" ON public.event_analytics
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ===== EVENT_LOGS =====
DROP POLICY IF EXISTS "Event owners can view logs" ON public.event_logs;

CREATE POLICY "Event owners can view logs" ON public.event_logs
  FOR SELECT TO authenticated USING (
    (event_id IS NULL AND actor_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM events WHERE events.id = event_logs.event_id AND events.user_id = auth.uid())
  );

-- Fix remaining restrictive policies to permissive
DROP POLICY IF EXISTS "Admin can update all events" ON public.events;
CREATE POLICY "Admin can update all events" ON public.events
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own events" ON public.events;
CREATE POLICY "Users can create their own events" ON public.events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can RSVP to live events" ON public.guests;
CREATE POLICY "Anyone can RSVP to live events" ON public.guests
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = guests.event_id AND events.status = 'live'::text AND events.rsvp_enabled = true
  ));

DROP POLICY IF EXISTS "Event owners can delete guests" ON public.guests;
CREATE POLICY "Event owners can delete guests" ON public.guests
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Anyone can submit music wishes to live events" ON public.music_wishes;
CREATE POLICY "Anyone can submit music wishes to live events" ON public.music_wishes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = music_wishes.event_id AND events.status = 'live'::text
  ));

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.event_analytics;
CREATE POLICY "Anyone can insert analytics" ON public.event_analytics
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "System can insert logs" ON public.event_logs;
CREATE POLICY "System can insert logs" ON public.event_logs
  FOR INSERT WITH CHECK (true);

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
