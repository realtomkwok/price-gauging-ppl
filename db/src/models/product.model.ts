import mongoose, { Schema, SchemaOptions } from "mongoose"
// import { IProduct, IWoolworthsProduct, IColesProduct } from "@/types/product.types";

const options: SchemaOptions = { discriminatorKey: 'retailerId', timestamps: true };

// Define the base schema
const productSchema: Schema = new Schema({
    id: { type: String, required: true },
    retailerId: { type: String, required: true },
    productId: { type: String, required: true },
    barcode: { type: String },
    name: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    packageSize: { type: String },
    pricing: [
        {
            trackedAt: { type: Date, required: true },
            current: { type: Number, required: true },
            was: { type: Number },
            unit: {
                price: { type: Number, required: true },
                measure: { type: String, required: true }
            },
            isOnSpecial: { type: Boolean, required: true },
            specialType: { type: [String], required: true },
            offerDescription: { type: String, required: true }
        }
    ],
    department: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    metadata: {
        createdAt: { type: Date, required: true },
        lastUpdated: { type: Date, default: Date.now(), required: true },
        imageUrls: { type: [String], required: true }
    }
}, options);

// Add common indexes
productSchema.index({ retailerId: 1, productId: 1 }, { unique: true });
productSchema.index({ name: 1 });
productSchema.index({ "pricing.trackedAt": -1 });
productSchema.index({ department: 1, category: 1, subCategory: 1 });

// Create the base model
const ProductModel = mongoose.model('ProductModel', productSchema);

// Create retailer-specific models using discriminators
const wwsProductSchema = new Schema({});
const wwsProductModel = ProductModel.discriminator('wws', wwsProductSchema);

const colesProductSchema = new Schema({});
const colesProductModel = ProductModel.discriminator('coles', colesProductSchema);

export { ProductModel, wwsProductModel, colesProductModel };