import * as XLSX from 'xlsx';
import fs from 'fs';

const xlsxToJson = (inputFile: string): any[] => {
    // Read the workbook
    const workbook = XLSX.readFile(inputFile);

    // Get the first worksheet (assuming data is in the first sheet)
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
};

const inputFile = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/metadata/stock-metadata.xlsx';
const outputFile = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/metadata/stock-metadata.json';

const jsonData = xlsxToJson(inputFile);

// Save the JSON data to a file
fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));

console.log(`XLSX file "${inputFile}" converted to JSON and saved as "${outputFile}".`);