import { MongoClient } from 'mongodb';
import fs from 'fs';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

async function main() {
    const uri = 'mongodb + srv://arcanauser:3Oh5sK2KL00IXqSV@cluster0.ettzzhe.mongodb.net';
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db('test').collection('stockstat');
        let index = 0;

        const fileStream = fs.createReadStream('/Users/ankitsanghvi/Desktop/arcana_backend/src/data/timeseries/mega.json', 'utf-8');
        const jsonStream = fileStream.pipe(parser()).pipe(streamArray());

        jsonStream.on('data', async ({ key, value }) => {
            try {
                await collection.insertOne(value);
                console.log(`Inserted document ${index + 1}`);
                index++;
            } catch (error) {
                console.error(`Error inserting document ${index + 1}:`, error);
            }
        });

        jsonStream.on('end', async () => {
            console.log('Data inserted successfully');
            await client.close();
        });

        jsonStream.on('error', (error) => {
            console.error('Error:', error);
        });
    } catch (error) {
        console.error('Error:', error);
        await client.close();
    }
}

main();
