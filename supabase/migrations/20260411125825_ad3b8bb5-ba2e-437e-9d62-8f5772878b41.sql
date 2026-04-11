CREATE POLICY "Anyone can view live events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (status = 'live');