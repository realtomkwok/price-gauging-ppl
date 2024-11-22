import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
    server: {
        SUPABASE_URL: z.string().url(),
        SUPABASE_ANON_KEY: z.string().min(1)
    },
    // clientPrefix: 'PUBLIC_', // Prefix for client environment variables
    // client: {
    //     PUBLIC_SUPABASE_URL: z.string().url(),
    //     PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
    // },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})