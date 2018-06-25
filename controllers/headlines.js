//Bring in our scape script and makedate scripts
var scarape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Bring in the Headline and Note moongoose models
var Headline = require("../models/Headlines");

//Send a request to scrape the data and send it into our collection if it is a new unique headline
module.exports = {
    fetch: function(cb) {
        scrape(function(data){
            var articles = data;
            for (var i=0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }

            Headlines.collection.insertMany(articles, {ordered:false}, function(err,docs) {
                cb(err, docs);
            });
        });
    },
        delete: function(query, cb) {
        Headlines.remove(query, cb);
    },
    get: function(query, cb) {
        Headlines.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc){
            cb(doc);
        });
    },
    update: function(query, cb){
        Headlines.update({_id: query._id},{
            $set: query
        }, {}, cb);
    }
}

