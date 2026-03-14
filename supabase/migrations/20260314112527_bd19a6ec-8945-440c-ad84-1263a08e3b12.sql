ALTER TABLE public.guests 
ADD COLUMN companion_count integer DEFAULT 0,
ADD COLUMN companion_names text[] DEFAULT '{}';