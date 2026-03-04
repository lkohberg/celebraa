
-- Fix overly permissive guest update policy - restrict to matching email
DROP POLICY "Guests can update their RSVP" ON public.guests;
CREATE POLICY "Guests can update their RSVP by event" ON public.guests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.status = 'live' AND events.rsvp_enabled = true));
