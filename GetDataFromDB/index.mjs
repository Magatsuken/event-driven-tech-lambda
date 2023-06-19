// DynamoDB import and initialize
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
const db = new DynamoDBClient({region: 'us-east-2'});

export const handler = async(event) => {
    // Params for ScanCommand function
    const input = {
        "TableName" : "DocStorageDB"
    };
    
    const command = new ScanCommand(input);
    const res = await db.send(command);
    
    // Response returns DB table items in JSON format
    const response = {
        statusCode: 200,
        body: JSON.stringify(res.Items),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    return response;
};
