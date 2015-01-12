var express = require('express');
var http = require('http');
var path = require('path');
var url = require('url');
var app = express();

var defaultCorsHeaders = {
  'Content-Type': 'text/plain',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var mimeTypes = {
  'html': 'text/html',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'js': 'text/javascript',
  'css': 'text/css'
};

app.all(function(req, res) {
  res.set(defaultCorsHeaders);
});

app.options(function(req, res) {
  res.status(200);
  res.end();
});

app.get('/', function(req, res) {
  res.sendFile('client/index.html', {root:'../client/'});
});

app.get('*',function(req,res) {
  //handle serving up all the files required by our index.html file
  var uri = url.parse(req.url).pathname;
  var filename = path.join('./../client', uri);
  path.exists(filename, function(exists) {
    if(!exists) {
      res.status(404);
      res.end('You done goofed.');
    }
    res.sendFile(filename, {root:'../client/'});
  });
});

http.createServer(app).listen(3000);

