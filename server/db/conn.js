const { MongoClient } = require('mongodb');
const connectionString = process.env.DB_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db('simple-calorie-app-db');
      console.log(`Successfully connected to MongoDB: ${connectionString}`);

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};