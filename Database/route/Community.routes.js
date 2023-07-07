module.exports = (app) => {
  const communities = require("../controller/Community.controller.js");
  app.get("/ping",(req,res)=>{res.send("pong");})
   app.post("/community/posts/:id/:CommunityId", communities.posts); //create post
  app.post("/community/home/:id", communities.UserCommunities);//get user communities or feed respectively
  app.post("/community/discover/:id", communities.discover);// get communities which are not joined by user # discover
  app.post("/community/NewCommunity/:id", communities.NewCommunity); //create new community
  app.get("/community/feed/:CommunityId", communities.getPostsByCommunityId);//showing feed for a particular communityid
  app.post("/community/createusercommunity", communities.insertItemintoUserCommunities);// inserting into user_communities items when user makes a request to join community and is succesfully granted
  app.post("/community/request/:id/:CommunityId", communities.requesttojoincommunity);// request to join a community
};
