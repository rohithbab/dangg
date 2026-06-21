import { createClient } from '@supabase/supabase-js'

const url = window.__SUPABASE_URL__ || import.meta.env.VITE_SUPABASE_URL
const key = window.__SUPABASE_SERVICE_KEY__ || import.meta.env.VITE_SUPABASE_SERVICE_KEY

export const supabase = createClient(url, key)
