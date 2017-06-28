var MongoClient = require('mongodb').MongoClient

var db;
var collection;
mongoURI = "mongodb://" + process.env.MONGODB_HOST + ":"
                        + process.env.MONGODB_PORT + "/"
                        + process.env.DB_NAME


exports.insert = function(tweets) {
  if(db === undefined || db === null){
    initDB(function(){
      insert(tweets);
    });
  }
  else{
    insert(tweets);
  }
}

function initDB(next){

  console.log("Connecting to " + mongoURI);
  // Use connect method to connect to the server
  MongoClient.connect(mongoURI, function(err, dbResp) {
    if(err){
      console.error("Unable to connect to MongoDB");
      return;
    }
    else{
      console.log("MongoDB Connected successfully to " + process.env.DB_NAME);
      db = dbResp;

      // Create a capped collection with a max size of 500MB
      db.createCollection("tweets", {capped:true, size: 524288000}, function(err, collectionResp) {
        collection = collectionResp
        next();
      });
    }
  });
}

function insert(tweets){
  // Insert some tweets
  collection.insert(tweets, function(err, result) {
    if(err){
      console.log("Failed to insert tweet");
      
      //reset the db object to force reconnect
      db = null;
    }
    else console.log("Inserted " + result.result.n + " tweet");
  });
}
