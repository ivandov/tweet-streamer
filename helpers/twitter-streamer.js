var Twitter = require('twitter');
var _ = require('lodash');

var client;
var term;
var clientstream = null;
var timer = null;
var calm = 1;

const isTweet = _.conforms({
    user: _.isObject,
    id_str: _.isString,
    text: _.isString,
});

function getClient() {
    return new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
}

exports.stream = function stream(){
  try {
    term = process.env.QUERY;
    console.log("Found QUERY set in .env");
  } catch (e) {
    console.log("QUERY not set as environment variable, unable to execute pull");
    console.log(e);
    return;
  }

  client = getClient();
  twearch(term);
}

/**
 * Stream tweets by keyword
 * Note: The tweet object is defined here:  https://dev.twitter.com/overview/api/tweets
 * Note: The user object is define here:  https://dev.twitter.com/overview/api/users
 **/
function twearch(term) {
    console.log("***** Streaming Tweets containing '"+term+"'. *****\n");
    if (clientstream==null || !clientstream.active) {
        client.stream('statuses/filter', {track: term}, function(stream) {
            clearTimeout(timer);
            clientstream = stream;
            clientstream.active = true;
            stream.on('data', function(tweet) {
                if (isTweet(tweet)) {
                    // console.log(tweet.user.name+" (@"+tweet.user.screen_name+") says:\n"+tweet.text);
                    console.log(tweet.text)
                    persist([tweet]);
                }
            });
            stream.on('end', function() {
                clientstream.active = false;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (clientstream.active) {
                        clientstream.destroy();
                    } else {
                        twearch();
                    }
                }, 1000 * calm * calm);
            });
            stream.on('error', function(error) {
                console.log(error);
                if (error.message == "Status Code: 402") {
                    calm++;
                }
            });
        });
    }
}

// app.get('/api/twearch', function(request, response) {
//     term = request.query.term;
//     calm = 1;
//     clearTimeout(timer);
//     if (clientstream!==null && clientstream.active) {
//         clientstream.destroy();
//     } else {
//         twearch(term);
//     }
//     response.status(200);
// 	response.setHeader('Content-Type', 'text/plain');
//     response.write("Streaming Tweets containing '"+term+"'.");
// 	response.end();
// 	return;
// });

function persist(tweets){
  if(tweets.length == 0) return;

  if(process.env.PERSIST){
    if(process.env.PERSIST.toUpperCase() === "CLOUDANT"){
      var cloudant = require('./cloudant');
      cloudant.insert(tweets);
    }

    if(process.env.PERSIST.toUpperCase() === "MONGODB"){
      var mongo = require('./mongodb');
      mongo.insert(tweets);
    }

    if(process.env.PERSIST.toUpperCase() === "ZKVSIM"){
      var zkvsim = require('./zkvsim');
      zkvsim.insert(tweets);
    }

    if(process.env.PERSIST.toUpperCase() === "ZKVSP"){
      var zkvsim = require('./zkvsp');
      zkvsim.insert(tweets);
    }
  }
}
