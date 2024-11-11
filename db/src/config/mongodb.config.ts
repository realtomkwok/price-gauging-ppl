import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/price-gauging-ppl"

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI)
		console.log("Connected to MongoDB successfully")
	} catch (error) {
		console.error("MongoDB connection error:", error)
		process.exit(1)
	}
}

mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err)
})

export { connectToMongoDB }
