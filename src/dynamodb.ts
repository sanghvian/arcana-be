const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIAXVK5ZIQT3XLR5TFG',
    secretAccessKey: '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',
});

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
