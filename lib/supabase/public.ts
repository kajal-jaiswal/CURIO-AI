import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createPublicClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey || url.includes('placeholder')) {
        return null
    }

    try {
        return createSupabaseClient(url, anonKey)
    } catch (error) {
        console.error('Error creating public Supabase client:', error)
        return null
    }
}
