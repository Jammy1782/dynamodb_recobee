const dynamoDb = require("../Connection.js");

const RequestTable = () => {
  const params = {
    TableName: "request",
    AttributeDefinitions: [
      { AttributeName: "communityId", AttributeType: "S" },
      { AttributeName: "requestorId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "communityId", KeyType: "HASH" },
      { AttributeName: "requestorId", KeyType: "RANGE" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  dynamoDb.createTable(params, (err, data) => {
    if (err) {
      console.error("Error creating request table:", err);
    } else {
      console.log(" request Table created successfully:", data);
    }
  });
};
module.exports = { RequestTable };
