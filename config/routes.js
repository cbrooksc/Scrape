//Server routes
//=============

//Bring in the Scrape function from our scripts directory
var scrape = require("../scripts/scrape");

//Bring headlines and notes for the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes")


module.exports = function(router) {
    //This route renders the hompage
    router.get("/", function(req, res) {
        res.render("home");
    });

    //This route renders the saved handlebars page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    //Creating a API route to fetch all the headlines articles
    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(){
            if (!doc || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                });
            }
        });
    });

    //grab all the headline in our database
    router.get("/api/headlines", function(req, res){
        //seting the query
        var query = {};
        if (req.query.save) {
            query = req.query;
        }
        //if the user doesn't return nothing
        //we are returning everything
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });

    //route to delete a specific article
    router.delete("/api/headlines/:id", function(req, res){
        var query = {};
        query.id = req.params.id;
        headlinesController.delete(query, function (err, data) { 
            res.json(data);
         });
    });
    //Create route to update if needed
    router.patch("/api/headlines", function (req, res) {  
        headlinesController.update(req.body, function (err, data) {  
            res.json(data);
        });
    });
    //Create route to handle all the note and display it to the user
    router.get("/api/notes/:headlines_id?", function (req, res) { 
        var query = {};
        if (req.params.headlines_id) {
            query.id = req.params.headlines_id;
        }

        notesController.get(query, function (err,data) {
            res.json(data);
          });
     });

     //creating route to delete our notes
     router.delete("/api/notes/:id", function (req, res) {  
         var query = {};
         query.id = req.params.id;
         notesController.delete(query, function (err, data) { 
             res.json(data);
          });
     });
     router.post("api/notes", function(req, res) {
        notesController.save(req.body, function (data) {
            res.json(data);
          });
     });
}