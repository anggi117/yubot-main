const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(`mongodb://yubot-mongo:27017/yubot_main`)
  .then(() => console.log("Mongo Connected!"));
