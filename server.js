// Route for our dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var mongojs = require("mongojs");

// Setup our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our express app
var app = express();

//Sets our view engine
//  app.engine('html', require('ejs').renderFile);
//coment this out for now
 app.set('view engine', 'html');
 app.engine("handlebars", exphbs({ defaultLayout: "main" }));
 app.set("view engine", "handlebars");
 app.enable('view cache');

// app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', '.hbs');

// Set up an Express Router
var router = express.Router();

//Require our routes file pass our router object
require("./config/routes")(router);

// Used for our public folder as a static dir
app.use(express.static(__dirname + "/public"));

// Use bodypaser in our app
app.use(bodyParser.urlencoded({
  extended: false
}));


// Every request will go through the router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to our database
mongoose.connect(db, function (error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log the success message
  else {
    console.log("mongoose connection is successful");
  }

})


//Listen on the Port
app.listen(PORT, function () {
  console.log("The is Listening on PORT:" + PORT);
});























