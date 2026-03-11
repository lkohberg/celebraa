
-- Create guest_photos table for guest-uploaded event photos
CREATE TABLE public.guest_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  guest_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can upload photos to live events
CREATE POLICY "Anyone can upload photos to live events"
ON public.guest_photos FOR INSERT TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = guest_photos.event_id
  AND events.status = 'live'
));

-- Anyone can view photos of live events
CREATE POLICY "Anyone can view photos of live events"
ON public.guest_photos FOR SELECT TO public
USING (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = guest_photos.event_id
  AND events.status = 'live'
));

-- Event owners can view their photos
CREATE POLICY "Event owners can view guest photos"
ON public.guest_photos FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = guest_photos.event_id
  AND events.user_id = auth.uid()
));

-- Admins can view all photos
CREATE POLICY "Admin can view all guest photos"
ON public.guest_photos FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create guest-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('guest-photos', 'guest-photos', true);

-- Anyone can upload to guest-photos bucket
CREATE POLICY "Anyone can upload guest photos"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'guest-photos');

-- Anyone can view guest photos
CREATE POLICY "Anyone can view guest photos storage"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'guest-photos');
