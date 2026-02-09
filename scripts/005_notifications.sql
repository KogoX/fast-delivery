-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own_or_broadcast"
  ON public.notifications
  FOR SELECT
  USING (target_user_id IS NULL OR auth.uid() = target_user_id);

CREATE POLICY "notifications_insert_authenticated"
  ON public.notifications
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Notification read receipts
CREATE TABLE IF NOT EXISTS public.notification_reads (
  notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (notification_id, user_id)
);

ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_reads_select_own"
  ON public.notification_reads
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notification_reads_insert_own"
  ON public.notification_reads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
