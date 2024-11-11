import { WwsTracker } from '@services/wws.service';
// import { ColesTracker } from '@services/coles.service';
import { WWS_CONFIG } from "@config/wws.config"
// import { COLES_CONFIG } from "@config/coles.config"
import { connectToMongoDB } from "@config/mongodb.config"


async function main() {
    try {
        await connectToMongoDB();

        // Track Woolworths products
        const wwsTracker = new WwsTracker();
        await wwsTracker.initialize();
        
        for (const category of WWS_CONFIG.categories) {
            try {
                const products = await wwsTracker.trackCategory(category);
                console.log(`Tracked ${products.length} Woolworths products in ${category.name}`);
                // Save products to your preferred storage
            } catch (error) {
                console.error(`Failed to track Woolworths category ${category.name}:`, error);
            }
        }
        
        await wwsTracker.cleanup();
        
        // // Track Coles products
        // const colesTracker = new ColesTracker();
        // await colesTracker.initialize();
        
        // for (const category of COLES_CONFIG.categories) {
        //     try {
        //         const products = await colesTracker.trackCategory(category);
        //         console.log(`Tracked ${products.length} Coles products in ${category.name}`);
        //         // Save products to your preferred storage
        //     } catch (error) {
        //         console.error(`Failed to track Coles category ${category.name}:`, error);
        //     }
        // }
        
        // await colesTracker.cleanup();
        
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

main();