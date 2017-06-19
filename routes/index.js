var express = require('express');
var router = express.Router();

cache = cache({base: './'});

/* GET home page. */
router.get('/', function(req, res, next) {

  cache.get("lastUpdate", function(err, lastUpdate){
    res.render('index',
    { title: 'Express',
      lastUpdate: lastUpdate
    });
  });

});


// FIXME uses logic from twitter-streamer, replace with websockets to update UI
router.get('/stream', function(request, response) {
  term = request.query.term;
  calm = 1;
  clearTimeout(timer);
  if (clientstream!==null && clientstream.active) {
    clientstream.destroy();
  } else {
    twearch(term);
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/plain');
  response.write("Streaming Tweets containing '"+term+"'.");
  response.end();
  return;
});

module.exports = router;
