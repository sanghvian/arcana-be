// src/db.ts
import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
    try {
        await mongoose.connect('mongodb+srv://arcanadmin:n7V499wP6eZXFBMi@cluster0.xiytxpy.mongodb.net/test');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}
