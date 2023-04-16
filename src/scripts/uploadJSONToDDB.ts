const fs = require('fs');
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: '...',
    secretAccessKey: '...',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'stock-metadata';
const filePath = '/Users/ankitsanghvi/Desktop/arcana_backend/src/data/metadata/stock-metadata.json';

function putItem(item: any) {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: item,
        };

        dynamodb.put(params, (error: any, data: any) => {
            if (error) {
                console.error('Error inserting item:', error);
                reject(error);
            } else {
                console.log('Inserted item:', item.symbol);
                resolve(data);
            }
        });
    });
}

async function main() {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonArray = JSON.parse(fileContent);

        for (const item of jsonArray) {
            await putItem(item);
        }

        console.log('All items inserted successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
