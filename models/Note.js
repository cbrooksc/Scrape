var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = Mongoose.Schema;

//Using the schema constructor, to create a new NoteSchema object
 var noteSchema = new Schema({

    _headlinesId: {
        type:Schema.Types.ObjectId,
        ref: "Headlines"
    },
    date:String,
    noteText: String
 });

 //Creates our model from the above schema, using mongoose's model method
 var Note = mongoose.model("Note", NoteSchema);

 //Export the Note Model
 module.exports = Note;