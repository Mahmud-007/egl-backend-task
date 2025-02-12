import mongoose from "mongoose";

// Function to connect to MongoDB
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return; // If already connected, no need to connect again
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default dbConnect;
