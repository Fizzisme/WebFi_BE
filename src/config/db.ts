import mongoose from 'mongoose';
import { env } from './environment.ts';

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('❌ MONGO_URI is not defined');
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'WEBFI',
        });

        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed', error);
        process.exit(1);
    }
};
