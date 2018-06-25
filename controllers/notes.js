//Controllers for our notes

var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    get: function(data, cb) {
        Note.find({
           headlinesId: data._id
        }, cb);
    },
    save: function(data,cb) {
        var newNote = {
            _headlinesId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        //Creates a note from the user
        Note.create(newNote, function (err, doc){
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    //removes the Note assocaiate with the article id
    delete: function(data, cb) {
        Note.remove({
            id: data._id

        }, cb );
    }
}