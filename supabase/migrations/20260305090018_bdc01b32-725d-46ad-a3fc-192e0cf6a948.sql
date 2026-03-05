ALTER TABLE public.events ADD COLUMN IF NOT EXISTS selected_blocks text[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_first_name text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_last_name text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_email text;