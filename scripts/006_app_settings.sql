-- App settings for pricing and locations
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_select_authenticated"
  ON public.app_settings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "app_settings_write_authenticated"
  ON public.app_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "app_settings_update_authenticated"
  ON public.app_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);
