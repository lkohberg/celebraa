
-- Re-add the policy on the base table so the security_invoker view works for anon
-- The view itself only exposes safe columns
CREATE POLICY "Anyone can view live events" ON public.events
  FOR SELECT
  USING (status = 'live');
