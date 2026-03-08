
CREATE POLICY "Admin can delete all events" ON public.events
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
