import { MongoClient } from 'mongodb';
import fs from 'fs';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';

async function main() {
    const uri = 'mongodb+srv://arcanauser:3Oh5sK2KL00IXqSV@cluster0.ettzzhe.mongodb.net/test?retryWrites=true&w=majority';
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db('test').collection('stockstat');
        let index = 0;

        const fileStream = fs.createReadStream('/Users/ankitsanghvi/Desktop/arcana_backend/src/data/timeseries/mega3.json', 'utf-8');
        const jsonParser = parser();
        const jsonStream = streamArray();
        const errorLogStream = fs.createWriteStream('error_log.txt', { flags: 'a' });

        const pipeline = chain([fileStream, jsonParser, jsonStream]);

        jsonStream.on('data', ({ key, value }) => {
            jsonStream.pause(); // Pause the stream

            collection.insertOne(value)
                .then(() => {
                    console.log(`Inserted document ${index + 1}`);
                    index++;
                    jsonStream.resume(); // Resume the stream
                })
                .catch((error) => {
                    console.error(`Error inserting document ${index + 1}:`, error);
                    errorLogStream.write(`Error inserting document ${index + 1}: ${error}\n`);
                    jsonStream.resume(); // Resume the stream
                });
        });

        pipeline.on('end', async () => {
            console.log('Data inserted successfully');
            errorLogStream.end();
            await client.close();
        });

        pipeline.on('error', (error) => {
            console.error('Pipeline error:', error);
            errorLogStream.write(`Pipeline error: ${error}\n`);
        });

        jsonParser.on('error', (error) => {
            console.error('Parser error:', error);
            errorLogStream.write(`Parser error: ${error}\n`);
            jsonParser.resume(); // Resume the parsing process
        });
    } catch (error) {
        console.error('Error:', error);
        await client.close();
    }
}

main();
