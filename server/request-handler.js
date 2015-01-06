
exports.requestHandler = function(request, response) {
  var fs = require('fs');
  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  if(request.url === '/messages') {
    if(request.method === 'GET') {
      fs.appendFile('./database/messages.txt','appended to the end of your dinosaur tail',returnMessagesFromFile);
        // returnMessagesFromFile();
    } else if (request.method === 'POST') {
      //POST!
    }
    // var data = {};
  } else {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end('you done goofed');
  }
  function returnMessagesFromFile(err, messages) {
    fs.readFile('./database/messages.txt', function(err, messages) {
      console.log('this ', messages);
      response.writeHead(statusCode, headers);
      headers['Content-Type'] = 'text/plain text';
      // response.end(JSON.stringify(messages));
      response.end(messages);
    });
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

//next steps:
//set up our database file- likely a json object
//finish get
//finish post
//connect our app to it.
//modify URL handling- create rooms, etc.
//sanitize input

