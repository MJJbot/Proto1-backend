var mongoose = require('mongoose');
var AutomaticQAScheme = mongoose.Schema({
    uid : Number,
    cid : String,
    qid : String,
    category : String,
    type : String,
    question : String,
    command : String,
    answer : String,
    enabled : Boolean,
    parameter : [{token : String, caption : String}]
  });
module.exports = AutomaticQAScheme;