const dynamoDb = require("../Connection.js");

const FeedTable = () => {
  const params = {
    TableName: "feed",
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" },
      { AttributeName: "SK", KeyType: "RANGE" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  dynamoDb.createTable(params, (err, data) => {
    if (err) {
      console.error("Error creating Feed table:", err);
    } else {
      console.log(" Feed Table created successfully:", data);
    }
  });
};
module.exports = {FeedTable};
