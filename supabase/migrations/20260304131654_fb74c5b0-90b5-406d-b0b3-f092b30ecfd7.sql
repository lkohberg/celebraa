
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================
-- EVENTS TABLE
-- =====================
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location_name TEXT,
  address TEXT,
  description TEXT,
  template_id TEXT NOT NULL,
  primary_color TEXT DEFAULT '#C8A951',
  font TEXT DEFAULT 'Playfair Display',
  event_link TEXT NOT NULL UNIQUE,
  rsvp_enabled BOOLEAN DEFAULT true,
  rsvp_deadline DATE,
  max_guests INTEGER,
  menu_selection BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'live', 'archived')),
  stripe_payment_id TEXT,
  price_paid INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view live events" ON public.events FOR SELECT USING (status = 'live');

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_event_link ON public.events(event_link);
CREATE INDEX idx_events_status ON public.events(status);

-- =====================
-- GUESTS TABLE (RSVP)
-- =====================
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
  plus_one BOOLEAN DEFAULT false,
  menu_choice TEXT,
  message TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view guests" ON public.guests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Event owners can delete guests" ON public.guests FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Anyone can RSVP to live events" ON public.guests FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.status = 'live' AND events.rsvp_enabled = true));
CREATE POLICY "Guests can update their RSVP" ON public.guests FOR UPDATE USING (true);

CREATE INDEX idx_guests_event_id ON public.guests(event_id);

-- =====================
-- EVENT ANALYTICS TABLE
-- =====================
CREATE TABLE public.event_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'rsvp_click', 'rsvp_submit', 'qr_scan')),
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view analytics" ON public.event_analytics FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_analytics.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Anyone can insert analytics" ON public.event_analytics FOR INSERT WITH CHECK (true);

CREATE INDEX idx_analytics_event_id ON public.event_analytics(event_id);
CREATE INDEX idx_analytics_event_type ON public.event_analytics(event_type);

-- =====================
-- EVENT LOG TABLE
-- =====================
CREATE TABLE public.event_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  actor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view logs" ON public.event_logs FOR SELECT
  USING (
    (event_id IS NULL AND actor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.events WHERE events.id = event_logs.event_id AND events.user_id = auth.uid())
  );
CREATE POLICY "System can insert logs" ON public.event_logs FOR INSERT WITH CHECK (true);

CREATE INDEX idx_logs_event_id ON public.event_logs(event_id);
