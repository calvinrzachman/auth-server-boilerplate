// Define Express Route Handlers
const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

// Create Middlware/Interceptor
const requireAuth = passportService.authenticate("jwt", { session: false });
const requireSignin = passportService.authenticate("local", { session: false });

module.exports = function(app) {
  // Function takes an app and defines routes
  app.get("/", requireAuth, (req, res, next) => {
    // The ordering of arguments specifies the order in which callbacks are called: 1. requireAuth, 2. (req, res, next)
    res.send(["What is up"]);
  });
  app.post("/signup", Authentication.signup);
  app.post("/signin", requireSignin, Authentication.signin);

  // To define additional protected routes use app.get() with the requireAuth middleware
};

// The `app` object represents the underlying express server and its associated Route Handlers.
// The call `app.get()` creates a new route handler watching for incoming HTTP GET requests
// More specifically it watches for requests to "/"

// `req` is an object representing incoming request
// `res` is an object representing the response
// `next` is for error handling
