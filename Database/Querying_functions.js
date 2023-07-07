const dynamoDb = require("./Connection.js");
module.exports = {
  getUserCommunities: async function (userCommunityParams) {
    try {
      const userCommunityData = await dynamoDb
        .query(userCommunityParams)
        .promise();
      return userCommunityData;
    } catch (error) {
      console.log(error);
    }
  },
  getCommunities: async function (communitiesParams) {
    try {
      const communitiesData = await dynamoDb.scan(communitiesParams).promise();
      return communitiesData;
    } catch (error) {
      console.log(error);
    }
  },
  insertPost: async function (postParams) {
    try {
      await dynamoDb.putItem(postParams).promise();
    } catch (error) {
      console.log(error);
    }
  },
  insertFeed: async function (feedParams) {
    try {
      await dynamoDb.batchWriteItem(feedParams).promise();
    } catch (error) {
      console.log(error);
    }
  },
  CreateNewCommunity: async function (communityParams) {
    try {
      await dynamoDb.putItem(communityParams).promise();
    } catch (error) {
      console.log(error);
    }
  },
  getAllUsersByCommunity: async function (params) {
    try {
      const result = await dynamoDb.query(params).promise();

      return result;
    } catch (err) {
      console.log("hello", err);
    }
  },

  getPostsByPostIds: async function (postParams) {
    try {
      const result = await dynamoDb.batchGetItem(postParams).promise();
      console.log("resultssssssss", result);
      const items = result.Responses.posts;
      return items;
    } catch (err) {
      console.error("Error occured:", err);
    }
  },
  queryFeed: async function (feedParams) {
    try {
      const result = await dynamoDb.query(feedParams).promise();
      return result;
    } catch (err) {
      console.error(err);
    }
  },
  getPostsByCommunityId: async function (Params) {
    try {
      const result = await dynamoDb.query(Params).promise();
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  insertItemintoUserCommunities: async function (Params) {
    try {
      await dynamoDb.putItem(Params).promise();
    } catch (error) {
      console.log(error);
    }
  },
  insertjoiningrequest: async function (Params) {
    try {
      await dynamoDb.putItem(Params).promise();
    } catch (error) {
      console.log(error);
    }
  }
};
