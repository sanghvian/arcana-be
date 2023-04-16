// src/stock.controller.ts
import { Stock } from '../models/stock.model';
import { dynamoDb } from '../dynamodb';

const tableName = 'stock-metadata'; // Replace with your DynamoDB table name

export async function createStock(stock: Stock): Promise<Stock> {
    await dynamoDb.put({
        TableName: tableName,
        Item: stock,
    }).promise();
    return stock;
}

export async function getStockById(id: string): Promise<Stock | null> {
    const result = await dynamoDb.get({
        TableName: tableName,
        Key: { id },
    }).promise();

    return result.Item as Stock || null;
}

export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
    const result = await dynamoDb.query({
        TableName: tableName,
        IndexName: 'symbol-index',
        KeyConditionExpression: 'symbol = :symbol',
        ExpressionAttributeValues: {
            ':symbol': symbol,
        },
    }).promise();
    return result.Item as Stock || null;
}

export async function getAllStocks(): Promise<Stock[]> {
    const result = await dynamoDb.scan({
        TableName: tableName,
    }).promise();
    return result.Items as Stock[] || [];
}

export async function updateStock(id: string, updates: Partial<Stock>): Promise<Stock | null> {
    const updateExpression = Object.keys(updates).map((key, index) => `${key} = :val${index}`).join(', ');
    const expressionAttributeValues = Object.values(updates).reduce((acc, value, index) => ({ ...acc, [`:val${index}`]: value }), {});

    const result = await dynamoDb.update({
        TableName: tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
    }).promise();

    return result.Attributes as Stock || null;
}

export async function deleteStock(id: string): Promise<boolean> {
    await dynamoDb.delete({
        TableName: tableName,
        Key: { id },
    }).promise();

    return true;
}
