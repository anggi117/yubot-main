const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.npb75cj.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Mongo Connected!"));
