import fs from 'fs';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import algoliasearch from 'algoliasearch';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// Replace these with your Algolia application ID and admin API key
const algoliaAppId = process.env.ALGOLIA_APP_ID;
const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;

// Replace this with the path to your JSON file containing the company information
const jsonFilePath = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/metadata/stock-metadata.json';

async function main() {
    try {
        // Initialize Algolia client
        const client = algoliasearch(algoliaAppId!, algoliaAdminApiKey!);
        const index = client.initIndex('stock-metadata');

        const fileStream = fs.createReadStream(jsonFilePath, 'utf-8');
        const jsonStream = fileStream.pipe(parser()).pipe(streamArray());

        jsonStream.on('data', async ({ key, value }) => {
            const { name, symbol, sector, industry, ceo, description } = value;

            const object = {
                objectID: symbol,
                name,
                symbol,
                sector,
                industry,
                ceo,
                description,
            };

            try {
                await index.saveObject(object);
                console.log(`Indexed object with symbol: ${symbol}`);
            } catch (error) {
                console.error(`Error indexing object with symbol: ${symbol}`, error);
            }
        });

        jsonStream.on('end', () => {
            console.log('Finished indexing stock metadata');
        });

        jsonStream.on('error', (error) => {
            console.error('Error:', error);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
