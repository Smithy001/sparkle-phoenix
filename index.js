'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');

const app = express();

//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));

//
// Create an HTTP server.
//
const server = http.createServer(app);

//
// Start the server.
//
server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
  });