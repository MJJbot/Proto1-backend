var mongoose = require('mongoose');
var AutomaticQAStaticScheme = mongoose.Schema({
    cid : String,
    qid : String,
    category : String,
    type : String,
    question : String,
    command : String,
    answer : String,
    parameter : [{token : String, caption : String}]
  });
module.exports = AutomaticQAStaticScheme;