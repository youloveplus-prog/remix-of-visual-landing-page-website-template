CREATE OR REPLACE FUNCTION public.increment_post_engagement(
  _post_id uuid,
  _field text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _field NOT IN ('likes', 'comments', 'shares') THEN
    RAISE EXCEPTION 'Invalid engagement field: %', _field;
  END IF;

  EXECUTE format(
    'UPDATE public.community_posts SET %I = %I + 1, updated_at = now() WHERE id = $1',
    _field, _field
  ) USING _post_id;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_post_engagement(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_engagement(uuid, text) TO authenticated;