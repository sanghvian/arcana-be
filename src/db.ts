// src/db.ts
import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
    try {
        await mongoose.connect('...');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}
