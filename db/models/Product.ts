import mongoose, { Schema } from 'mongoose';
import { IProduct, IWoolworthsProduct, IColesProduct } from "@/types/product.types"

// Common base product schema
const productSchema = new Schema<IProduct>({
	id: { type: String, required: true, unique: true },
	retailerId: { type: String, required: true },
	productId: { type: String, required: true },
	name: { type: String, required: true },
	brand: { type: String, required: true },
	description: { type: String, required: true },
    packageSize: { type: String, required: true },

    pricing: [{
        trackedAt: { type: Date, required: true },
        current: { type: Number, required: true },
        was: { type: Number, required: true },
        unit: {
            price: { type: Number, required: true },
            measure: { type: String, required: true },
        },
        isOnSpecial: { type: Boolean, required: true },
        specialType: { type: [String], required: true },
        offerDescription: { type: String, required: true },
    }],

    department: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },

    metadata: {
        createdAt: { type: Date, required: true },
        lastUpdated: { type: Date, required: true },
        imageUrls: { type: [String], required: true },
    },
}, {
    timestamps: true,
    discriminatorKey: 'retailerId' // Using retailerId as the discriminator key
});

// Add common indexes
productSchema.index({ retailerId: 1, productId: 1 }, { unique: true });
productSchema.index({ name: 1 });
productSchema.index({ "pricing.trackedAt": -1 });
productSchema.index({ department: 1, category: 1, subCategory: 1 });

// Create the base model
const Product = mongoose.model<IProduct>('Product', productSchema);

// Create retailer-specific models using discriminators
const WoolworthsProduct = Product.discriminator<IWoolworthsProduct>(
    'wws',
    new Schema({})
);

const ColesProduct = Product.discriminator<IColesProduct>(
    'coles',
    new Schema({})
);

export { Product, WoolworthsProduct, ColesProduct };