import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseApiKey: string = import.meta.env.VITE_SUPABASE_API_KEY

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseApiKey)