const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(process.env.MONGO_DRIVER)
    .then((client) => {
      console.log("Connected to MongoDB");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found");
};

module.exports = { mongoConnect, getDb };
