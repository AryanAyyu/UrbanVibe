import mongoose from 'mongoose';

const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGO_URL not provided');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'urbanvibe' });
  console.log('MongoDB connected');
};

export default connectDB;
