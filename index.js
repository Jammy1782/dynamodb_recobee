const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

require("./Database/route/Community.routes.js")(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
