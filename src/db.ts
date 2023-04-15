// src/db.ts
import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
    try {
        await mongoose.connect('mongodb+srv://arcanauser:3Oh5sK2KL00IXqSV@cluster0.ettzzhe.mongodb.net/test');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}
