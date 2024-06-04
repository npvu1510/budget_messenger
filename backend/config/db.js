import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI_STRING);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
