
-- 1. order_items: server-side price enforcement
CREATE OR REPLACE FUNCTION public.enforce_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  authoritative_price numeric;
BEGIN
  SELECT price INTO authoritative_price FROM public.products WHERE id = NEW.product_id;
  IF authoritative_price IS NULL THEN
    RAISE EXCEPTION 'Invalid product_id: %', NEW.product_id;
  END IF;
  NEW.price := authoritative_price;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_order_item_price_trg ON public.order_items;
CREATE TRIGGER enforce_order_item_price_trg
BEFORE INSERT OR UPDATE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_item_price();

-- 2. profiles: prevent self-write of privileged columns
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.coins       := OLD.coins;
  NEW.trust_score := OLD.trust_score;
  NEW.is_verified := OLD.is_verified;
  NEW.is_banned   := OLD.is_banned;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_privileged_fields_trg ON public.profiles;
CREATE TRIGGER protect_profile_privileged_fields_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- 3. pod_designs: prevent self-write of moderation fields
CREATE OR REPLACE FUNCTION public.protect_pod_design_moderation_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.status           := OLD.status;
  NEW.is_public        := OLD.is_public;
  NEW.sales_count      := OLD.sales_count;
  NEW.approved_at      := OLD.approved_at;
  NEW.rejection_reason := OLD.rejection_reason;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_pod_design_moderation_fields_trg ON public.pod_designs;
CREATE TRIGGER protect_pod_design_moderation_fields_trg
BEFORE UPDATE ON public.pod_designs
FOR EACH ROW EXECUTE FUNCTION public.protect_pod_design_moderation_fields();

-- 4. posts: prevent self-pinning
CREATE OR REPLACE FUNCTION public.protect_post_pin_field()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.is_pinned := OLD.is_pinned;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_post_pin_field_trg ON public.posts;
CREATE TRIGGER protect_post_pin_field_trg
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.protect_post_pin_field();

-- 5. messages: recipients can only flip is_read
CREATE OR REPLACE FUNCTION public.protect_message_columns_on_recipient_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() <> OLD.sender_id THEN
    NEW.content    := OLD.content;
    NEW.media_url  := OLD.media_url;
    NEW.media_type := OLD.media_type;
    NEW.sender_id  := OLD.sender_id;
    NEW.chat_id    := OLD.chat_id;
    NEW.created_at := OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_message_columns_trg ON public.messages;
CREATE TRIGGER protect_message_columns_trg
BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.protect_message_columns_on_recipient_update();

-- 6. Storage: prevent listing of public product-images bucket via storage API.
-- Files stay reachable by direct public URL (public bucket), but listing is denied.
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;

-- 7. Lock down trigger helper functions from direct execution by clients.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalculate_order_total() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_order_item_price() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_privileged_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_pod_design_moderation_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_post_pin_field() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_message_columns_on_recipient_update() FROM PUBLIC, anon, authenticated;
