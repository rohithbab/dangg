import { createClient } from '@supabase/supabase-js'

const url = window.__SUPABASE_URL__ || import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const key = window.__SUPABASE_SERVICE_KEY__ || import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'placeholder-key'

export const supabase = createClient(url, key)
