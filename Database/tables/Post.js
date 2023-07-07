const dynamoDb = require("../Connection.js");

const PostTable = () => {
  const params = {
    TableName: "posts",
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "CommunityId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" },
      { AttributeName: "SK", KeyType: "RANGE" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "CommunityIdIndex",
        KeySchema: [
          { AttributeName: "CommunityId", KeyType: "HASH" }, // Attribute used as index key
          // Define additional attributes for the index here
        ],
        Projection: {
          ProjectionType: "ALL", // Adjust based on your projection needs
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5, // Adjust based on your requirements
          WriteCapacityUnits: 5, // Adjust based on your requirements
        },
      },
      // Define additional global secondary indexes here
    ],
  };

  dynamoDb.createTable(params, (err, data) => {
    if (err) {
      console.error("Error creating Post table:", err);
    } else {
      console.log("Post Table created successfully:", data);
    }
  });
};
module.exports = {PostTable};
