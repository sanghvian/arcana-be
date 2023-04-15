// csv-upload.ts
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Replace the following with your own MongoDB connection URI and folder path
const uri = 'mongodb+srv://arcanauser:3Oh5sK2KL00IXqSV@cluster0.ettzzhe.mongodb.net/test';
const folderPath = '';

async function readCsvFile(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const data: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row: any) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

async function uploadDataToMongo(uri: string, collectionName: string, data: any[]): Promise<void> {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('myDatabase'); // Replace with your database name
        const collection = db.collection(collectionName);

        await collection.insertMany(data);

        console.log(`Data from ${collectionName} uploaded successfully`);
        await client.close();
    } catch (err) {
        console.error('Error uploading data to MongoDB:', err);
        throw err;
    }
}

async function main() {
    try {
        const files = await fs.promises.readdir(folderPath);
        const csvFiles = files.filter((file) => path.extname(file).toLowerCase() === '.csv');

        for (const file of csvFiles) {
            const filePath = path.join(folderPath, file);
            const data = await readCsvFile(filePath);
            const collectionName = path.basename(file, '.csv');
            await uploadDataToMongo(uri, collectionName, data);
        }
    } catch (err) {
        console.error('Error occurred:', err);
    }
}

main();