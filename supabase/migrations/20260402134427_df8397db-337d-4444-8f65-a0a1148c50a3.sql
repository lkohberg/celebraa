
-- Remove public read policy
DROP POLICY IF EXISTS "Anyone can read active promo codes" ON public.promo_codes;

-- Create secure validation function
CREATE OR REPLACE FUNCTION public.validate_promo_code(p_code text)
RETURNS TABLE(valid boolean, discount_value numeric, discount_type text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    true AS valid,
    pc.discount_value,
    pc.discount_type
  FROM public.promo_codes pc
  WHERE pc.code = upper(p_code)
    AND pc.active = true
    AND (pc.max_uses IS NULL OR pc.current_uses < pc.max_uses)
    AND (pc.expires_at IS NULL OR pc.expires_at > now());
$$;
