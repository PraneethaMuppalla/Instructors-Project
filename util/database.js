const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const MongoConnect = (cb) => {
  MongoClient.connect(process.env.MONGO_DRIVER)
    .then((result) => {
      console.log("connected");
      cb(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = MongoConnect;
