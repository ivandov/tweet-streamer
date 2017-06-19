Twitter Streamer
===============

This app opens a Twitter stream to get any tweets matching a search. When a tweet is received, it is persisted in a database.

The streamer automatically starts streaming tweets based on settings in `.env`. Results are only tweets that have been tweeted since you started the streaming service. There is no historical provided by this application.

This app relies heavily on the node-twitter package.  See:
-  https://www.npmjs.com/package/twitter
-  https://github.com/desmondmorris/node-twitter
It also uses a workaround for resetting the search term.  See:
-  https://github.com/desmondmorris/node-twitter/issues/159

### Pre-Reqs
Get Twitter credentials at https://dev.twitter.com/

Modify and save the `template.env` file as `.env` and include the following minimum environment variable requirements:
 - `TWITTER_CONSUMER_KEY=generated-consumer-key`
 - `TWITTER_CONSUMER_SECRET=generated-consumer-secret`
 - `TWITTER_ACCESS_TOKEN_KEY=2862807485-generated-access-token-key`
 - `TWITTER_ACCESS_TOKEN_SECRET=generated-access-token-secret`
 - `QUERY="#MyHashtagSearch"` or `QUERY="other text"`


### Persisting to DB
If local cache storage is insufficient, you can choose to persist the fetched tweets into a database. Currently the only supported DB is Cloudant, but MongoDB should be added soon. To write to a DB, the following additional environment variables are required:
 - `PERSIST=CLOUDANT` or `PERSIST=MONGODB`
 - `DB_NAME=query_db` - A name that corresponds to the query this fetcher is running

##### Cloudant Settings
  - `CLOUDANT_HOST=127.0.0.1`
  - `CLOUDANT_PORT=8080`
  - `CLOUDANT_USER=user`
  - `CLOUDANT_PASS=pass`

##### MongoDB Settings
  - `MONGODB_HOST=127.0.0.1`
  - `MONGODB_PORT=27017`
