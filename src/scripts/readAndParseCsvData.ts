import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';

interface CsvRow {
    ds: string;
    symbol: string;
    close: number;
    volume: number;
    log_returns: number;
    volatility: number;
    value_at_risk: number;
}

interface JsonObject {
    stock_symbol: string;
    date: string;
    close: number;
    volume: number;
    volatility: number | null;
}

const csvDirectory = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/stocks';
const outputFilePath = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/timeseries/mega4.json';

async function processCsvFile(filePath: string) {
    const csvData = await fs.promises.readFile(filePath, 'utf-8');

    return new Promise<void>((resolve, reject) => {
        Papa.parse<CsvRow>(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                    reject(new Error(`Error parsing CSV data: ${results.errors}`));
                    return;
                }

                const jsonObjects: JsonObject[] = results.data.map((row) => ({
                    stock_symbol: row.symbol,
                    date: row.ds,
                    close: +row.close,
                    volume: +row.volume,
                    volatility: +row.volatility || null
                }));

                const outputData = jsonObjects.map((obj) => JSON.stringify(obj)).join(',\n');

                fs.promises.appendFile(outputFilePath, outputData + ',\n').then(resolve).catch(reject);
            },
        });
    });
}

async function main() {
    try {
        const files = await fs.promises.readdir(csvDirectory);
        const csvFiles = files.filter((file) => path.extname(file).toLowerCase() === '.csv');

        // Write the opening square bracket of the JSON array
        await fs.promises.writeFile(outputFilePath, '[\n');

        for (const csvFile of csvFiles) {
            const filePath = path.join(csvDirectory, csvFile);
            console.log(`Processing: ${filePath}`);
            await processCsvFile(filePath);
        }

        // Remove the trailing comma and close the JSON array
        const currentContent = await fs.promises.readFile(outputFilePath, 'utf-8');
        await fs.promises.writeFile(outputFilePath, currentContent.trim().slice(0, -1) + '\n]\n');

        console.log('Processing completed successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();