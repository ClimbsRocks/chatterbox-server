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

exports.requestHandler = function(request, response) {
  var fs = require('fs');
  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  if (request.method === 'OPTIONS') {
    // add needed headers
    var headers = {};
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = true;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept';
    // respond to the request
    response.writeHead(200, headers);
    response.end();
  } else if(request.url === '/messages') {
    if(request.method === 'GET') {
      returnMessagesFromFile();
    } else if (request.method === 'POST') {
      console.log('post request');
      var body = '';
      request.on('data', function (chunk) {
        body += chunk;
      });
      request.on('end', function () {
        postMessageToFile(body);
      });
      return;
    }
    // var data = {};
  } else if(request.url === '/') {
    fs.readFile('../client/client/index.html', function(err, file) {
      headers['Content-Type'] = 'text/html';
      response.writeHead(200, headers);
      response.end(file);
    });
  } else {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(450, headers);
    response.end('You done goofed.');
  }

  function returnMessagesFromFile() {
    fs.readFile('./database/messages.txt', function(err, messages) {

      if(err) {
        console.error(err);
        response.writeHead(500, headers);
        response.end('We let you down.');
        return;
      }

      messages = messages.toString() || '{"results": []}';

      response.writeHead(statusCode, headers);
      headers['Content-Type'] = 'application/json';
      response.end(messages);
    });
  }

  function postMessageToFile(newMessage) {
    fs.readFile('./database/messages.txt', function(err, data) {

      if(err) {
        console.error(err);
        response.writeHead(500, headers);
        response.end('We let you down.');
        return;
      }

      console.log('data.toJSON: ', '|' + data.toString() === '' + '|');
      if(data.toString() === '') {
        data = '{"results" : []}';
      }
      var messages = JSON.parse(data.toString());
      var parsedNewMessage = JSON.parse(newMessage);
      parsedNewMessage['time'] = Date.now();

      messages.results.push(parsedNewMessage);

      fs.writeFile('./database/messages.txt', JSON.stringify(messages), function(err) {
        if(err) {
          console.error(err);
          response.writeHead(500, headers);
          response.end('We let you down.');
          return;
        }

        response.writeHead(200, headers);
        response.end('It has been done.');
        return;
      });
    });
  }
};


//next steps:
//>set up our database file- likely a json object
//>finish get
//>finish post
//>connect our app to it.
//modify URL handling- create rooms, etc.
//sanitize input

