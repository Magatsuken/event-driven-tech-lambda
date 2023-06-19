// Import DynamoDB and S3 Client
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize Clients
const db = new DynamoDBClient({region: 'us-east-2'});
const s3 = new S3Client({region: 'us-east-2'});

export const handler = async(event) => {
    const fileName = 'Final_MOCK_DATA.csv';
    const bucketName = 'nick-storage-for-csv';
    
    // Params for ScanCommand function
    const input = {
        "TableName" : "DocStorageDB"
    };
    
    // Scan DB, store in fileData
    let command = new ScanCommand(input);
    let res = await db.send(command);
    const fileData = Object.values(res.Items);
    
    // Modifiable csvFile with the first line as header
    let csvFile = 'id, first_name, last_name, email, gender, ip_address';
    
    // Iterate through fileData, add each parameter to csvFile
    for (let i = 0; i < fileData.length - 1; i++) {
        let id = Object.values(fileData[i].id);
        let first_name = Object.values(fileData[i].first_name);
        let last_name = Object.values(fileData[i].last_name);
        let email = Object.values(fileData[i].email);
        let gender = Object.values(fileData[i].gender);
        let ip_address = Object.values(fileData[i].ip_address);
        let line = `\n${id}, ${first_name}, ${last_name}, ${email}, ${gender}, ${ip_address}`;
        csvFile += line;
    }
    
    // Parameters for PutObjectCommand function
    const params = {
        Bucket: `${bucketName}`,
        Key: `${fileName}`,
        Body: `${csvFile}`
    };
    
    // Attempt to call command
    command = new PutObjectCommand(params);
    try {
        const response = await s3.send(command);
    } catch (err) {
        console.log(err);
    }
    
    const params2 = {
        Bucket: `${bucketName}`,
        Key: `${fileName}`,
    };
    
    // Get a signed url
    command = new GetObjectCommand(params2);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
    // Return status code 200, signedUrl
    const response = {
        statusCode: 200,
        body: signedUrl,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    return response;
};
