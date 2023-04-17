//! NOTE: This file actually is not being used in the project since we are using MongoDB.
// This was more of an experiment we tried running with DynamoDB 
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: '...',
    secretAccessKey: '...',
});

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
