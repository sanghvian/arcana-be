import { MongoClient } from 'mongodb';
import fs from 'fs';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';

async function main() {
    const uri = '...';
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db('test').collection('stockstatsssssss');
        let index = 0;

        const fileStream = fs.createReadStream('/Users/ankitsanghvi/Desktop/arcana_backend/src/data/timeseries/mega4.json', 'utf-8');
        const jsonParser = parser();
        const jsonStream = streamArray();
        const errorLogStream = fs.createWriteStream('error_log.txt', { flags: 'a' });

        const pipeline = chain([fileStream, jsonParser, jsonStream]);

        const processDocument = async ({ key, value }: any) => {
            console.log(`Processing document ${index + 1}:`, JSON.stringify(value));
            try {
                await collection.insertOne(value);
                console.log(`Inserted document ${index + 1}`);
            } catch (error) {
                console.error(`Error inserting document ${index + 1}:`, error);
                errorLogStream.write(`Error inserting document ${index + 1}: ${error}\n`);
            }
            index++;
        };

        for await (const item of pipeline) {
            try {
                await processDocument(item);
            } catch (error) {
                console.error(`Error processing document ${index + 1}:`, error);
                errorLogStream.write(`Error processing document ${index + 1}: ${error}\n`);
                index++;
            }
        }

        console.log('Data inserted successfully');
        errorLogStream.end();
        await client.close();
    } catch (error) {
        console.error('Error:', error);
        await client.close();
    }
}

main();
