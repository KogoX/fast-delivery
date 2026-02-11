-- Add admin flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Tighten app_settings write policies to admins only
DROP POLICY IF EXISTS "app_settings_write_authenticated" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_update_authenticated" ON public.app_settings;

CREATE POLICY "app_settings_write_admin_only"
  ON public.app_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "app_settings_update_admin_only"
  ON public.app_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Tighten notifications insert policy to admins only
DROP POLICY IF EXISTS "notifications_insert_authenticated" ON public.notifications;

CREATE POLICY "notifications_insert_admin_only"
  ON public.notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
