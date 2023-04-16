// src/readCsvAndStoreInDynamoDB.ts
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Transform, pipeline, Writable } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

// Set the AWS region
AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIAXVK5ZIQT3XLR5TFG',
    secretAccessKey: 'PLefRgJ8JPWiy2DZzeGKm3g676sutY50UxZgzPt0',
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'stockdata'; // Replace with your DynamoDB table name

const csvDirectory = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/stocks2'; // Replace with the path to your CSV directory

const BATCH_SIZE = 25;

let batchItems: any[] = [];
let processedKeys: Set<string> = new Set();

async function storeRowInDynamoDB(row: any): Promise<void> {
    const item = {
        ds: row.ds,
        symbol: row.symbol,
        close: row.close ? parseFloat(row.close) : null,
        volume: row.volume ? parseInt(row.volume, 10) : null,
        volatility: row.volatility ? parseFloat(row.volatility) : null,
        value_at_risk: row.value_at_risk ? parseFloat(row.value_at_risk) : null,
    };

    const itemKey = `${item.ds}-${item.symbol}`;
    if (processedKeys.has(itemKey)) {
        console.warn(`Duplicate item detected: ${itemKey}`);
        return;
    }

    processedKeys.add(itemKey);
    batchItems.push(item);

    if (batchItems.length >= BATCH_SIZE) {
        await flushBatchItemsToDynamoDB();
    }
}
async function flushBatchItemsToDynamoDB(): Promise<void> {
    if (batchItems.length === 0) return;

    const batchWriteParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
        RequestItems: {
            [tableName]: batchItems.map((item) => ({
                PutRequest: {
                    Item: item,
                },
            })),
        },
    };

    try {
        await dynamoDb.batchWrite(batchWriteParams).promise();
        console.log(`Stored ${batchItems.length} items in DynamoDB`);
    } catch (error) {
        console.error(`Error storing batch items in DynamoDB:`, error);
    }

    batchItems = [];
}

async function processCsvFile(filePath: string): Promise<void> {
    try {
        const readStream = fs.createReadStream(filePath);
        const parseStream = csv();

        const processStream = new Writable({
            objectMode: true,
            write: async (row, _, done) => {
                try {
                    await storeRowInDynamoDB(row);
                    done();
                } catch (error) {
                    console.error(`Error storing row from ${filePath}:`, error);
                    done(error as any);
                }
            },
        });

        await pipelineAsync(readStream, parseStream, processStream);
        console.log(`Finished processing ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

async function processStreamCsvFile(filePath: string): Promise<void> {
    try {
        const readStream = fs.createReadStream(filePath);
        const parseStream = csv();

        const processStream = new Transform({
            objectMode: true,
            highWaterMark: 1, // Control the number of items being processed concurrently
            transform: async (row, _, done) => {
                try {
                    await storeRowInDynamoDB(row);
                    done();
                } catch (error) {
                    console.error(`Error storing row from ${filePath}:`, error);
                    done(error as any);
                }
            },
        });

        await pipelineAsync(readStream, parseStream, processStream);
        await flushBatchItemsToDynamoDB(); // Flush any remaining items
        console.log(`Finished processing ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

async function main(): Promise<void> {
    try {
        const fileNames = fs.readdirSync(csvDirectory);
        const csvFiles = fileNames.filter((fileName) => path.extname(fileName).toLowerCase() === '.csv');

        for (const csvFile of csvFiles) {
            const filePath = path.join(csvDirectory, csvFile);
            // await processCsvFile(filePath);
            await processStreamCsvFile(filePath);
        }

        await flushBatchItemsToDynamoDB(); // Flush any remaining items

        console.log('Finished processing all CSV files');
    } catch (error) {
        console.error('Error processing CSV files:', error);
    }
}

main();
