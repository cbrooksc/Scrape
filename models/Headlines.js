var mongoose = require('mongoose');

// save a reference to the scheme constructor
var scheme = mongoose.Schema;

// Creates a new userSchema object
var headlinesSchema = new Schema({

    headlines: {
        type: String,
        required: true,
        unique:true
    },
    summary: {
        type: String,
        required: true
    },

    date: String,
    saved: {
        type: Boolean,
        required: false
    },
    

    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
//Creates our model form the above schema,using mongoose's model method
var Article = mongoose.model("Headlines", headlinesSchema);
//export the Article model
module.exports = Headlines;