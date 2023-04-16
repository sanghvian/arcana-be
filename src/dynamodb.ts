const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: '...',
    secretAccessKey: '...',
});

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
