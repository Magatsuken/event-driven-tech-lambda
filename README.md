# event-driven-tech-lambda
Backend lambda functions for event driven technical study

# S3 Trigger
Triggered on file submission. Parses text and records data to DynamoDB table

# GetDataFromDB
GET request, scan DynamoDB table, return data as JSON to frontend to use to populate table

# Dynamo-To-S3
GET request, scan DynamoDB, write data as a CSV file, store in S3 bucket, create and return temporary download link to CSV file
