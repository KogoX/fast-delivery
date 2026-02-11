'use server'

import { createClient } from '@/lib/supabase/server'

async function ensureAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' as const }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { error: 'Admin access required' as const }
  }

  return { supabase }
}

export interface PricingLocationsSettings {
  ridePricing: {
    carFare: number
    bikeFare: number
    serviceFee: number
  }
  locations: string[]
}

const SETTINGS_KEY = 'pricing_locations'

export async function getPricingLocationsSettings(): Promise<PricingLocationsSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', SETTINGS_KEY)
    .single()

  if (error || !data?.value) {
    return {
      ridePricing: { carFare: 200, bikeFare: 100, serviceFee: 20 },
      locations: [
        'Baraton University Main Gate',
        'Baraton University Library',
        'Baraton University Cafeteria',
        'Baraton University Chapel',
        'Baraton University Admin Block',
        'Baraton University Hostels - Male',
        'Baraton University Hostels - Female',
        'Baraton Shopping Center',
        'Baraton Health Center',
        'Baraton Sports Complex',
        'Kapsabet Town',
        'Nandi Hills',
        'Eldoret Town',
      ],
    }
  }

  return data.value as PricingLocationsSettings
}

export async function updatePricingLocationsSettings(settings: PricingLocationsSettings) {
  const admin = await ensureAdmin()
  if ('error' in admin) {
    return { error: admin.error }
  }

  const { error } = await admin.supabase.from('app_settings').upsert({
    key: SETTINGS_KEY,
    value: settings,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
