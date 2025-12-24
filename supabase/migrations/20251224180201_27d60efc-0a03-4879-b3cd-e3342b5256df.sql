-- POD Design Status Enum
CREATE TYPE public.pod_design_status AS ENUM ('pending', 'approved', 'rejected');

-- POD Designs Table (user-uploaded designs)
CREATE TABLE public.pod_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status pod_design_status DEFAULT 'pending',
  is_public BOOLEAN DEFAULT false,
  sales_count INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  price_modifier NUMERIC DEFAULT 0,
  rejection_reason TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- POD Products Table (products generated from designs)
CREATE TABLE public.pod_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES public.pod_designs(id) ON DELETE CASCADE NOT NULL,
  product_type TEXT NOT NULL DEFAULT 't-shirt',
  base_price NUMERIC NOT NULL DEFAULT 499,
  creator_commission NUMERIC DEFAULT 50,
  colors TEXT[] DEFAULT ARRAY['black', 'white', 'navy'],
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  placement TEXT DEFAULT 'front',
  is_active BOOLEAN DEFAULT true,
  delivery_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- POD Orders Extension (links orders to POD products)
CREATE TABLE public.pod_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE NOT NULL,
  pod_product_id UUID REFERENCES public.pod_products(id) ON DELETE SET NULL,
  design_id UUID REFERENCES public.pod_designs(id) ON DELETE SET NULL,
  selected_color TEXT NOT NULL,
  selected_size TEXT NOT NULL,
  print_status TEXT DEFAULT 'pending',
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Design Favorites (users can favorite designs)
CREATE TABLE public.pod_design_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  design_id UUID REFERENCES public.pod_designs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, design_id)
);

-- Enable RLS on all tables
ALTER TABLE public.pod_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_design_favorites ENABLE ROW LEVEL SECURITY;

-- POD Designs Policies
CREATE POLICY "Anyone can view approved public designs" 
ON public.pod_designs FOR SELECT 
USING (status = 'approved' AND is_public = true);

CREATE POLICY "Users can view own designs" 
ON public.pod_designs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all designs" 
ON public.pod_designs FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create designs" 
ON public.pod_designs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending designs" 
ON public.pod_designs FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update any design" 
ON public.pod_designs FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete own pending designs" 
ON public.pod_designs FOR DELETE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can delete any design" 
ON public.pod_designs FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- POD Products Policies
CREATE POLICY "Anyone can view active POD products" 
ON public.pod_products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage POD products" 
ON public.pod_products FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create products for own approved designs" 
ON public.pod_products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pod_designs 
    WHERE id = design_id 
    AND user_id = auth.uid() 
    AND status = 'approved'
  )
);

-- POD Order Items Policies
CREATE POLICY "Users can view own POD order items" 
ON public.pod_order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.id = order_item_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage POD order items" 
ON public.pod_order_items FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create POD order items" 
ON public.pod_order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.id = order_item_id AND o.user_id = auth.uid()
  )
);

-- Design Favorites Policies
CREATE POLICY "Users can view own favorites" 
ON public.pod_design_favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" 
ON public.pod_design_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" 
ON public.pod_design_favorites FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_pod_designs_updated_at
BEFORE UPDATE ON public.pod_designs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pod_products_updated_at
BEFORE UPDATE ON public.pod_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for POD designs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pod-designs', 'pod-designs', true);

-- Storage policies for POD designs bucket
CREATE POLICY "Anyone can view POD designs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'pod-designs');

CREATE POLICY "Authenticated users can upload designs" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'pod-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own design files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'pod-designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own design files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'pod-designs' AND auth.uid()::text = (storage.foldername(name))[1]);