import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGO-DB WORKING...");
  } catch (error) {
    console.log("MONGO DB FAILED TO CONNECT", error.message);
  }
};
