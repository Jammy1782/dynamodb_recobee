const Community_modal = require("../model/Community.modal.js");
const dynamo = require("../Connection.js");
//discover
const discover = async (req, res) => {
  const userId = req.params.id;
  let lastEvaluatedKey = null;
  if (req.body.lastEvaluatedKey) {
    lastEvaluatedKey = req.body.lastEvaluatedKey;
  }
  console.log(lastEvaluatedKey);
  try {
    const data = await Community_modal.DiscoverItems(userId, lastEvaluatedKey);
    res.send(data);
    return;
  } catch (error) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting the communities",
    });
  }
};
//get not joined communities or feed respectly for a user
const UserCommunities = async (req, res) => {
  const userId = req.params.id;

  const lastEvaluatedKey = null;
  const CommunityIds = [];
  if (req.body.lastEvaluatedKey) {
    lastEvaluatedKey = req.body.lastEvaluatedKey;
  }
  if (req.body.CommunityIds) {
    CommunityIds = req.body.CommunityIds;
  }
  try {
    const data = await Community_modal.UserCommunities(
      userId,
      lastEvaluatedKey,
      CommunityIds
    );
    res.send(data);
    return;
  } catch (error) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting the user communities",
    });
  }
};
//create a new post
const posts = async (req, res) => {
  try {
    await Community_modal.Posts(req);
    res.send("Post created successfully");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: err.message || "Some error occurred while inserting the post",
    });
  }
};
// create a new community
const NewCommunity = async (req, res) => {
  const NewCommunityobj = {
    _id: { S: "123" },
    name: { S: req.body.name },
    desc: { S: req.body.desc },
    createdBy: { S: req.params.id },
    isPrivate: { BOOL: req.body.isPrivate },
    memberCnt: { N: req.body.memberCnt.toString()},
    adminIds: { S: [req.params.id].toString() },
    coverimg: { S: req.body.coverimg },
    tags: { S: req.body.tags },
    isDeleted: { BOOL: false },
    communityType: { S: req.body.communityType },
  };
  try {
    await Community_modal.CreateCommunity(NewCommunityobj);
    res.send("Community created successfully");
    return;
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: err.message || "Some error occurred while creating Community",
    });
  }
};
//feed for  aspecfic community id
const getPostsByCommunityId = async (req, res) => {
  const coummunityId = req.params.CommunityId;
  try {
    const data = await Community_modal.getPostsByCommunityId(coummunityId);
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: err.message || "Some error occurred while getting the feeds",
    });
  }
};
const insertItemintoUserCommunities = async function (req, res) {
  id = "159";
  userId = req.body.userId;
  communityId = req.body.communityId;
  obj = {
    _id: { S: id },
    userId: { S: userId },
    communityId: { S: communityId },
  };
  // const params = {
  //   TableName: "user_communities",
  //   Item: {
  //     _id: { S: "1256" },
  //     userId: { S: "1345" },
  //     communityId: { S: "122" },
  //   },
  // };
  try {
    await Community_modal.insertItemintoUserCommunities(obj);
    res.send("inserted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while inserting user communities",
    });
  }
};
const requesttojoincommunity = async function (req, res) {
  
  obj = {
    _id: { S: "1256" },
    requestorId: {S:req.params.id},
    communityId: {S:req.params.CommunityId},
    type:{N:(req.body.type).toString()},
    requestStatus: {S:"pending"},
    adminIds: {S:(req.body.adminIds).toString()},

  };
  try {
    await Community_modal.requesttojoincommunity(obj);
    res.send("request sent successfully");
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send({
      message:
        err.message || "Some error occurred while requesting to join community",
    });
  }
}
module.exports = {
  discover,
  UserCommunities,
  posts,
  NewCommunity,
  getPostsByCommunityId,
  insertItemintoUserCommunities,
  requesttojoincommunity,
};
