
DROP POLICY "System can insert logs" ON public.event_logs;

CREATE POLICY "Authenticated users can log own events" ON public.event_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
    AND (
      event_id IS NULL
      OR EXISTS (SELECT 1 FROM events WHERE events.id = event_logs.event_id AND events.user_id = auth.uid())
    )
  );
