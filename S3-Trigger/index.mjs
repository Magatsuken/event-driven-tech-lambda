// This triggers off an object being dropped into the S3 Bucket

// S3 client import and initialize
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
const s3 = new S3Client({region: 'us-east-2'});

// DynamoDB import and initialize
import { DynamoDBClient, CreateTableCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
const db = new DynamoDBClient({region: 'us-east-2'});
    
export const handler = async(event) => {
    // Get Bucket name and key
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    // Call GetObjectCommand function to get file and read output stream
    const response = await s3
        .send(new GetObjectCommand(params));
    const stream = await response.Body.transformToString();
    
    // Split by new line to get each line of each object
    const splitStream = stream.split('\n');

    // Iterate through each object, recording each key/value pair to DynamoDB table
    for (let i = 1; i < splitStream.length - 1; i++) {
        let line = splitStream[i].split('\t');
        let id = line[0];
        let first_name = line[1];
        let last_name = line[2];
        let email = line[3];
        let gender = line[4];
        let ip_address = line[5];
        
        const input = {
            "Item": {
                "id": {
                  "N": `${id}`  
                },
                "first_name": {
                    "S": `${first_name}`
                },
                "last_name": {
                    "S": `${last_name}`
                },
                "email": {
                    "S": `${email}`
                },
                "gender": {
                    "S": `${gender}`
                },
                "ip_address": {
                    "S": `${ip_address}`
                }
                },
                "ReturnConsumedCapacity": "TOTAL",
                "TableName": "DocStorageDB"
            };
    
        const command = new PutItemCommand(input);
        const res = await db.send(command);
    }
}