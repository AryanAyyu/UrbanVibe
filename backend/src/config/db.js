import mongoose from 'mongoose';

const attachConnectionLogging = () => {
  const conn = mongoose.connection;
  conn.on('connected', () => console.log('MongoDB connected'));
  conn.on('disconnected', () => console.warn('MongoDB disconnected'));
  conn.on('reconnected', () => console.log('MongoDB reconnected'));
  conn.on('error', (err) => console.error('MongoDB error', err));
};

const connectDB = async (uri) => {
  if (!uri) throw new Error('MONGO_URL not provided');
  mongoose.set('strictQuery', true);
  const options = {
    dbName: 'urbanvibe',
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
  };
  attachConnectionLogging();
  await mongoose.connect(uri, options);
};

export default connectDB;
