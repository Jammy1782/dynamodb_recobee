const dynamoDb = require("../Connection.js");


const UserCommunitiesTable=()=>{
const params = {
  TableName: "user_communities",
  KeySchema: [
    { AttributeName: "userId", KeyType: "HASH" },
    { AttributeName: "communityId", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "userId", AttributeType: "S" },
    { AttributeName: "communityId", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "CommunityIdIndex",
      KeySchema: [
        { AttributeName: "communityId", KeyType: "HASH" }, // Attribute used as index key
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
    console.error("Error creating usercommunities table:", err);
  } else {
    console.log("usercommunities Table created successfully:", data);
  }
});
}
module.exports={UserCommunitiesTable};

