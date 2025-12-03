import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("connecting to db...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("success: connected to db");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
