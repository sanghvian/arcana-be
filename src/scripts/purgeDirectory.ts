import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Replace this with the path to your directory containing the CSV files
const csvDirectory = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/stocks3';

async function isCsvEmpty(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let isEmpty = true;

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', () => {
                isEmpty = false;
            })
            .on('end', () => {
                resolve(isEmpty);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

async function main() {
    try {
        const files = await fs.promises.readdir(csvDirectory);

        for (const file of files) {
            const filePath = path.join(csvDirectory, file);
            const fileStats = await fs.promises.stat(filePath);

            if (fileStats.isFile() && path.extname(file) === '.csv') {
                const isEmpty = await isCsvEmpty(filePath);

                if (isEmpty) {
                    console.log(`Deleting empty CSV file: ${file}`);
                    await fs.promises.unlink(filePath);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
