import { createClient } from "@supabase/supabase-js"
import { Database } from "./types/supabase.type"
import { env } from "./env"

// Initialize Supabase client
const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
