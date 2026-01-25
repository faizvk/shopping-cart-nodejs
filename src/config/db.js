import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};

export default connectDB;
