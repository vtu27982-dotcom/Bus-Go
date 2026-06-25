import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Use memory server if local mongodb is not running (e.g. URI is localhost)
    if (!uri || uri.includes('127.0.0.1')) {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using MongoDB In-Memory Server');
    }

    const conn = await mongoose.connect(uri as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
