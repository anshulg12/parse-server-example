// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_s2w90fr1:kjp5b11cmv6i2mji21a2p8ff7b@ds021299.mlab.com:21299/heroku_s2w90fr1',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'R511mtiNs4yEJ7I4e2D0mfe8hqOd3k0xq1B9PHW2',
  masterKey: process.env.MASTER_KEY || 'o3NQgCPVibPkbdPk0bo0gmKkKhkMbmBRqXKz3sN3', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  clientKey:'VVdS1v1JvLDOAS7QAQCEd0lIajs1C9d45p7fbMC9',
  javascriptKey:'8uKhBJLfaSTrMRrgIXZm',
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  oauth: {
    facebook: {
      appIds: "539139566241716"
    }
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

