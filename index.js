// Main Starting Point of the Application
const express = require("express");
const http = require("http"); // Native node library
const bodyParser = require("body-parser"); // Parse requests as though it is JSON
const morgan = require("morgan"); // Logging framework

const app = express();
const router = require("./router");

// MongoDB Setup - run mongodb with command mongod
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:auth/auth",
  { useNewUrlParser: true }
);
mongoose.connect(
  "mongodb://localhost:27017/auth",
  { useNewUrlParser: true }
);
// Creates a new database called `auth`

// App Setup - Express
// Register Middleware - Incoming requests passed through these
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));

router(app); // Give app access to function defined in router.js

// Server Setup - Express talks to outside world
const port = process.env.PORT || 3090;
const server = http.createServer(app); // Create an http server which forwards information to express app
server.listen(port);
console.log("Server listening on port: ", port);
