
-- Auto-disable music when a copyright report is submitted
CREATE OR REPLACE FUNCTION public.handle_copyright_report()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET block_config = jsonb_set(
    COALESCE(block_config, '{}'::jsonb),
    '{music_disabled}',
    'true'::jsonb
  )
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_copyright_report_insert
  AFTER INSERT ON public.copyright_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_copyright_report();
