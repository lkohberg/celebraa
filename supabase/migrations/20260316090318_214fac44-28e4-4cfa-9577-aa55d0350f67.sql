
-- Copyright reports table
CREATE TABLE public.copyright_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  reporter_email text,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid
);

ALTER TABLE public.copyright_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a report
CREATE POLICY "Anyone can submit copyright report"
  ON public.copyright_reports FOR INSERT TO public
  WITH CHECK (true);

-- Only admins can view/update reports
CREATE POLICY "Admins can view all reports"
  ON public.copyright_reports FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.copyright_reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
  ON public.copyright_reports FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
