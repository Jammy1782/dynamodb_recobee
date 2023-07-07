//note: comments before which stars(******) are given has to be taken into account

const dynamo = require("../Querying_functions.js");
module.exports = {
  //create a new community
  CreateCommunity: async function (Communityobj) {
    const NewCommunityParams = {
      TableName: "communities",
      Item: Communityobj,
    };
    try {
      await dynamo.CreateNewCommunity(NewCommunityParams);
    } catch (error) {
      console.log("error occured:", error);
    }
  },
  //discover
  DiscoverItems: async function (userID, lastEvaluatedKey) {
    let CommunityRes = {};
    const userCommunityParams = {
      TableName: "user_communities",
      KeyConditionExpression: "userId = :userid",
      ExpressionAttributeValues: {
        ":userid": { S: userID },
      },
    };
    try {
      const userCommunityData = await dynamo.getUserCommunities(
        userCommunityParams
      );
      const excludedCommunityIds = userCommunityData.Items.map(
        (item) => item.communityId.S
      );
      console.log(excludedCommunityIds);
      const communitiesParams = {
        TableName: "communities",
      };
      // ******logic has to be changed
      //******page index has to be applied
      // if (lastEvaluatedKey) {
      //   communitiesParams.ExclusiveStartKey = lastEvaluatedKey;
      // }
      const communitiesData = await dynamo.getCommunities(communitiesParams);

      const filteredArray = communitiesData.Items.filter((item) => {
        return !excludedCommunityIds.includes(item._id.S);
      });

      CommunityRes.items = filteredArray;
      // CommunityRes.lastEvaluatedKey = communitiesData.LastEvaluatedKey;
    } catch (err) {
      console.log(err);
    }
    return CommunityRes;
  },
  //get not joined communities or feed respectly for a user
  UserCommunities: async function (userId, lastEvaluatedKey, CommunityIds) {
    let userCommunityRes = {};
    const userCommunityParams = {
      TableName: "user_communities",
      KeyConditionExpression: "userId = :userid",
      ExpressionAttributeValues: {
        ":userid": { S: userId },
      },
    };
    let userCommunityData = CommunityIds;
    try {
      if (lastEvaluatedKey == null && userCommunityData.length == 0) {
        userCommunityData = await dynamo.getUserCommunities(
          userCommunityParams
        );
        const UserCommunityIds = userCommunityData.Items.map(
          (item) => item.communityId.S
        );

        userCommunityRes.communityIds = UserCommunityIds;
      }

      if (userCommunityData.Items.length == 0) {
        const communitiesParams = {
          TableName: "communities",
          Limit: 10,
        };
        const communitiesData = await dynamo.getCommunities(communitiesParams);
        userCommunityRes.items = communitiesData.Items;
        userCommunityRes.no_of_communities = 0;
      } else {
        const feedParams = {
          TableName: "feed",
          Limit: 10,
          KeyConditionExpression: "PK = :pk",
          ExpressionAttributeValues: {
            ":pk": { S: userId },
          },
          ProjectionExpression: "PostId",
        };
        if (lastEvaluatedKey) {
          queryFeedInput.ExclusiveStartKey = lastEvaluatedKey;
        }
        const feedData = await dynamo.queryFeed(feedParams);
        //******have to make a index on postid of posts table and then we have to find all the posts by postids(multiple posts ids)
        //******feedData.Items is an array of postids

        // const Postparams = {
        //   RequestItems: {
        //     "posts": {
        //       Keys: feedData.Items.map((item) => ({
        //         PostId: { S: item.PostId.S},
        //       })),
        //     },
        //   },
        // };

        // const postData = await dynamo.getPostsByPostIds(Postparams);
        userCommunityRes.no_of_communities = userCommunityData.Items.length;
        userCommunityRes.lastEvaluatedKey = feedData.LastEvaluatedKey;

        //******after finding the items from posts table we have to insert into userCommunityRes.items as an array of objects
        // userCommunityRes.items = postData.Items;
      }
    } catch (err) {
      console.log(err);
    }
    return userCommunityRes;
  },
  // //create a new post
  Posts: async function (req) {
    let createDat = new Date();
    let time = createDat.toISOString();

    const Postobj = {
      PostId: { S: "C#COM-" + req.params.CommunityId + "#T-" + time },
      PostType: { S: "COMMUNITY" },
      Content: { S: req.body.Content },
      Likes: { N: "0" },
      Dislikes: { N: "0" },
      CommunityId: { S: req.params.CommunityId },
      userId: { S: req.params.id },
      SK: { S: "COMMUNITY#USER-" + req.params.CommunityId + "#T-" + time },
      PK: { S: "COM-" + req.params.CommunityId },
      Rating: { N: req.body.rating.toString() },
      createdAt: { S: time },
    };
    const PostParams = {
      TableName: "posts",
      Item: Postobj,
    };

    const AllUserByCommunityParams = {
      TableName: "user_communities",
      IndexName: "CommunityIdIndex",
      KeyConditionExpression: "communityId = :communityId",
      ExpressionAttributeValues: {
        ":communityId": { S: req.params.CommunityId },
      },
      ProjectionExpression: "userId",
    };

    try {
      await dynamo.insertPost(PostParams);
      const users = await dynamo.getAllUsersByCommunity(
        AllUserByCommunityParams
      );

      const Feedparams = {
        RequestItems: {
          feed: [],
        },
      };

      users.Items.forEach((user) => {
        Feedparams.RequestItems["feed"].push({
          PutRequest: {
            Item: {
              PostId: { S: "C#COM-" + req.params.CommunityId + "#T-" + time },
              PostType: { S: "COMMUNITY" },
              FromUserId: { S: req.params.id },
              SK: { S: "FEED#T-" + time },
              PK: user.userId,
              createdAt: { S: time },
            },
          },
        });
      });

      await dynamo.insertFeed(Feedparams);
    } catch (err) {
      console.log(err);
    }
  },
  getPostsByCommunityId: async function (communityId) {
    const ReturnObj = {};
    const params = {
      TableName: "posts",
      IndexName: "CommunityIdIndex",
      KeyConditionExpression: "CommunityId = :id",
      ExpressionAttributeValues: {
        ":id": { S: communityId },
      },
    };
    console.log(params);
    try {
      const data = await dynamo.getPostsByCommunityId(params);
      ReturnObj.items = data.Items;
      return ReturnObj;
    } catch (err) {
      console.log(err);
    }
  },
  insertItemintoUserCommunities: async function (obj) {
    const params = {
      TableName: "user_communities",
      Item: obj,
    };
    try {
      await dynamo.insertItemintoUserCommunities(params);
    } catch (error) {
      console.log(error);
    }
  },
  requesttojoincommunity: async function (obj) {
    const params = {
      TableName: "request",
      Item: obj,
    };
    try {
      await dynamo.insertjoiningrequest(params);
    } catch (error) {
      console.log(error);
    }
  },
};
