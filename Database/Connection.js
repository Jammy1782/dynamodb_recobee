const AWS = require("aws-sdk");

// Set the DynamoDB endpoint to the local instance
const dynamoDb = new AWS.DynamoDB({
  region: "localhost",
  endpoint: "http://localhost:8000",
  accessKeyId: "dummy",
  secretAccessKey: "dummy",
});

module.exports = dynamoDb;

