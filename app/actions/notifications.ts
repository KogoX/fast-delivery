'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUnreadNotificationsCount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { count: 0 }
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('id')
    .or(`target_user_id.is.null,target_user_id.eq.${user.id}`)

  if (error) {
    return { count: 0, error: error.message }
  }

  if (!notifications || notifications.length === 0) {
    return { count: 0 }
  }

  const { data: reads, error: readsError } = await supabase
    .from('notification_reads')
    .select('notification_id')
    .eq('user_id', user.id)

  if (readsError) {
    return { count: 0, error: readsError.message }
  }

  const readIds = new Set((reads ?? []).map((read) => read.notification_id))
  const unreadCount = notifications.filter((notification) => !readIds.has(notification.id)).length

  return { count: unreadCount }
}

interface CreateNotificationParams {
  title: string
  body: string
  targetUserId?: string | null
}

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('notifications').insert({
    title: params.title,
    body: params.body,
    target_user_id: params.targetUserId || null,
    created_by: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
