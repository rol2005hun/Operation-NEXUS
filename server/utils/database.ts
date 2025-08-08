import mongoose from 'mongoose';
import { success, error, info } from './discord-logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/opnexus';

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await info('[DATABASE] Attempting to connect to MongoDB...');
        const connection = await mongoose.connect(MONGODB_URI);
        isConnected = true;
        await success('[DATABASE] Successfully connected to MongoDB.');
        return connection;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        await error(`[DATABASE] MongoDB connection failed: ${err instanceof Error ? err.message : 'Unknown error'}.`);
        throw err;
    }
}

export async function disconnectFromDatabase() {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        await info('[DATABASE] Disconnected from MongoDB.');
    } catch (err) {
        console.error('MongoDB disconnection error:', err);
        await error(`[DATABASE] MongoDB disconnection failed: ${err instanceof Error ? err.message : 'Unknown error'}.`);
        throw err;
    }
}