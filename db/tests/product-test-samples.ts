import { connectToMongoDB } from "@/config/mongodb.config";
import { Product } from "@/models/Product";

async function createTestSamples() {
    try {
        await connectToMongoDB();
        
        // Woolworths Banana Sample
        const wwsBanana = new Product({
            barcode: "0264011000002",
            retailerId: "wws",
            lastUpdated: new Date(),
            basic: {
                name: "Cavendish Bananas",
                displayName: "Cavendish Bananas Each",
                description: "Cavendish Bananas Each",
                urlFriendlyName: "cavendish-bananas",
                images: {
                    small: "https://cdn0.woolworths.media/content/wowproductimages/small/133211.jpg",
                    medium: "https://cdn0.woolworths.media/content/wowproductimages/medium/133211.jpg",
                    large: "https://cdn0.woolworths.media/content/wowproductimages/large/133211.jpg",
                },
            },
            retailerData: {
                woolworths: {
                    stockcode: 133211,
                    gtinFormat: 13,
                    isBundle: false,
                    price: {
                        current: 0.72,
                        cup: {
                            value: 0.72,
                            measure: "1EA",
                            display: "$0.72 / 1EA"
                        },
                        isOnSpecial: false,
                        savingsAmount: 0
                    },
                    details: {
                        unit: "Each",
                        packageSize: "Each"
                    }
                }
            },
            categories: [{
                retailerId: "wws",
                categoryId: "1_B08374601",
                name: "Fruit & Vegetables",
                path: ["Fresh Food", "Fruit & Vegetables", "Fruit"]
            }]
        });
        
        // Coles Apple Sample
        const colesApple = new Product({
            barcode: "0012345678901",
            retailerId: "coles",
            lastUpdated: new Date(),
            basic: {
                name: "Pink Lady Apples",
                displayName: "Pink Lady Apples Each",
                urlFriendlyName: "pink-lady-apples-each",
                images: {
                    small: "https://shop.coles.com.au/small/apple.jpg",
                    medium: "https://shop.coles.com.au/medium/apple.jpg",
                    large: "https://shop.coles.com.au/large/apple.jpg",
                }
            },
            retailerData: {
                coles: {
                    productCode: "APP123",
                    price: {
                        current: 0.80,
                        cup: {
                            value: 0.80,
                            measure: "1EA",
                            display: "$0.80 / EA"
                        },
                        isOnSpecial: true,
                        was: 1.00,
                        savingsAmount: 0.20,
                        specialType: "Price Drop"
                    },
                    details: {
                        brand: "Fresh Produce",
                        packageSize: "Each",
                        unit: "EA"
                    }
                }
            },
            categories: [{
                retailerId: "coles",
                categoryId: "fruit-veg-789",
                name: "Fruit & Vegetables",
                path: ["Fresh", "Fruit & Vegetables", "Fruit", "Apples"]
            }],
            priceHistory: [{
                retailerId: "coles",
                timestamp: new Date(),
                price: 0.80,
                wasPrice: 1.00,
                isSpecial: true,
                specialType: "Price Drop"
            }]
        });
        
        await Promise.all([
            wwsBanana.save(),
            colesApple.save()
        ]);
        
        console.log('Test samples created successfully');
        
        // Verify the samples
        const samples = await Product.find({
            retailerId: { $in: ['wws', 'coles'] }
        });
        console.log('Retrieved samples:', samples);
        
    } catch (error) {
        console.error('Error creating test samples:', error);
    }
}

createTestSamples();