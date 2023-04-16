import { MongoClient } from 'mongodb';
import fs from 'fs';

// Read data from JSON file
const data = JSON.parse(fs.readFileSync('/Users/ankitsanghvi/Desktop/arcana_backend/src/data/timeseries/mega.json', 'utf-8'));

// MongoDB connection configuration
const uri = 'mongodb+srv://arcanauser:3Oh5sK2KL00IXqSV@cluster0.ettzzhe.mongodb.net';
const dbName = 'test';
const collectionName = 'stockstats';

// Connect to MongoDB and upload data
const uploadDataToMongoDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Upload the data to the collection
        const result = await collection.insertMany(data);

        console.log(`Successfully inserted ${result.insertedCount} documents.`);

        // Close the connection
        await client.close();
    } catch (err) {
        console.error('Error uploading data to MongoDB:', err);
    }
};

uploadDataToMongoDB();

