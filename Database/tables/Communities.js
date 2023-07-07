const dynamoDb = require("../Connection.js");

// const createTable = () => {
//   const params = {
//     TableName: "myTable",
//     KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 5,
//       WriteCapacityUnits: 5,
//     },
//   };

//   dynamoDb.createTable(params, (err, data) => {
//     if (err) {
//       console.error("Error creating table:", err);
//     } else {
//       console.log("Table created successfully:", data);
//     }
//   });
// };

// module.exports = createTable;
const createCommunitiesTable=()=>{
const params = {
  TableName: "communities",
  AttributeDefinitions: [
    { AttributeName: "_id", AttributeType: "S" },
    { AttributeName: "createdBy", AttributeType: "S" },
  ],
  KeySchema: [
    { AttributeName: "_id", KeyType: "HASH" },
    { AttributeName: "createdBy", KeyType: "RANGE" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamoDb.createTable(params, (err, data) => {
  if (err) {
    console.error("Error creating communities table:", err);
  } else {
    console.log("Communities Table creating successfully:", data);
  }
});
}
module.exports={createCommunitiesTable};