-- Fix: Remove price information leakage from error messages
-- Only show generic error to clients, keeping details hidden

CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  catalog_price DECIMAL(10,2);
BEGIN
  -- Get current product price from catalog
  SELECT price INTO catalog_price
  FROM public.products
  WHERE id = NEW.product_id;
  
  -- If product doesn't exist, reject with generic message
  IF catalog_price IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Validate submitted price matches catalog (allow 0.01 rounding difference)
  -- Do NOT expose actual prices in error messages
  IF ABS(NEW.price - catalog_price) > 0.01 THEN
    RAISE EXCEPTION 'Price validation failed. Please refresh and try again.';
  END IF;
  
  RETURN NEW;
END;
$$;