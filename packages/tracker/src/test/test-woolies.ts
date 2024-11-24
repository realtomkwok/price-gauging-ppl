import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '../types/database.types'
import { WooliesTracker } from '../functions/woolies'
import { env } from '../env'

async function testWooliesTracker() {
    const supabase = createClient<Database>(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY
    )

    try {
        console.log('Starting Woolies tracker test...')
        
        let { data: wws_tracking_categories, error } = await supabase
            .from('wws_tracking_categories')
            .select('*')
            .range(0, 2)
        
        console.log('Test categories:', wws_tracking_categories)
        
        // Create test tracker instance with test mode enabled
        const tracker = new WooliesTracker(supabase, wws_tracking_categories!)
        
        // Run the tracker
        await tracker.track()
        
        // Query and log results
        const { data: products } = await supabase
            .from('products')
            .select('*')
        
        console.log(`Test completed! Found ${products?.length || 0} products`)
    } catch (error) {
        console.error('Test failed:', error)
    } finally {
        await supabase.auth.signOut()
    }
}

testWooliesTracker() 