var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = Mongoose.Schema;

//Using the schema constructor, to create a new NoteSchema object
 var NoteSchema = new Schema({

    title: String,

    body: String
 });

 //Creates our model from the above schema, using mongoose's model method
 var Note = mongoose.model("Note", NoteSchema);

 //Export the Note Model
 module.exports = Note;