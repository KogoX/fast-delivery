-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  student_id TEXT,
  avatar_url TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Rides table
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  ride_type TEXT NOT NULL CHECK (ride_type IN ('car', 'bike')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  fare DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 50,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  driver_name TEXT,
  driver_rating DECIMAL(3, 2),
  driver_image TEXT,
  cancellation_reason TEXT,
  estimated_arrival INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rides_select_own" ON public.rides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rides_insert_own" ON public.rides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rides_update_own" ON public.rides FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "rides_delete_own" ON public.rides FOR DELETE USING (auth.uid() = user_id);

-- Restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  rating DECIMAL(3, 2) DEFAULT 4.5,
  delivery_time TEXT DEFAULT '15-20 min',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "restaurants_select_all" ON public.restaurants FOR SELECT TO authenticated USING (true);

-- Menu items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_items_select_all" ON public.menu_items FOR SELECT TO authenticated USING (true);

-- Food orders table
CREATE TABLE IF NOT EXISTS public.food_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 300,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  delivery_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_orders_select_own" ON public.food_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "food_orders_insert_own" ON public.food_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "food_orders_update_own" ON public.food_orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "food_orders_delete_own" ON public.food_orders FOR DELETE USING (auth.uid() = user_id);

-- Package deliveries table
CREATE TABLE IF NOT EXISTS public.package_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_size TEXT NOT NULL CHECK (package_size IN ('small', 'medium', 'large', 'extra-large')),
  delivery_time TEXT NOT NULL CHECK (delivery_time IN ('standard', 'express', 'scheduled')),
  delivery_notes TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  delivery_fee DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 50,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.package_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "package_deliveries_select_own" ON public.package_deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "package_deliveries_insert_own" ON public.package_deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "package_deliveries_update_own" ON public.package_deliveries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "package_deliveries_delete_own" ON public.package_deliveries FOR DELETE USING (auth.uid() = user_id);

-- Errands table
CREATE TABLE IF NOT EXISTS public.errands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_location TEXT NOT NULL,
  errand_location TEXT NOT NULL,
  errand_type TEXT NOT NULL CHECK (errand_type IN ('pickup', 'purchase', 'queue', 'other')),
  description TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('standard', 'urgent', 'scheduled')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  additional_notes TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  service_fee DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 50,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  runner_name TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.errands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "errands_select_own" ON public.errands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "errands_insert_own" ON public.errands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "errands_update_own" ON public.errands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "errands_delete_own" ON public.errands FOR DELETE USING (auth.uid() = user_id);

-- Insert sample restaurants
INSERT INTO public.restaurants (name, image, rating, delivery_time, tags) VALUES
  ('Campus Cafeteria', '/placeholder.svg?height=80&width=80', 4.5, '15-20 min', ARRAY['Local', 'African']),
  ('Bowen Grill House', '/placeholder.svg?height=80&width=80', 4.2, '20-30 min', ARRAY['Grill', 'Fast Food']),
  ('Green Leaf Cafe', '/placeholder.svg?height=80&width=80', 4.7, '10-15 min', ARRAY['Healthy', 'Salads']);

-- Insert sample menu items
DO $$
DECLARE
  cafeteria_id UUID;
  grill_id UUID;
  green_leaf_id UUID;
BEGIN
  SELECT id INTO cafeteria_id FROM public.restaurants WHERE name = 'Campus Cafeteria';
  SELECT id INTO grill_id FROM public.restaurants WHERE name = 'Bowen Grill House';
  SELECT id INTO green_leaf_id FROM public.restaurants WHERE name = 'Green Leaf Cafe';

  INSERT INTO public.menu_items (restaurant_id, name, description, price, image) VALUES
    (cafeteria_id, 'Jollof Rice & Chicken', 'Spicy jollof rice with grilled chicken', 1200, '/placeholder.svg?height=60&width=60'),
    (cafeteria_id, 'Fried Rice & Fish', 'Fried rice with fried fish', 1300, '/placeholder.svg?height=60&width=60'),
    (grill_id, 'Grilled Chicken Burger', 'Grilled chicken with lettuce and special sauce', 1500, '/placeholder.svg?height=60&width=60'),
    (green_leaf_id, 'Caesar Salad', 'Fresh vegetables with Caesar dressing', 1000, '/placeholder.svg?height=60&width=60');
END $$;