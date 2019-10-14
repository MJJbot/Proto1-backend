var mongoose = require('mongoose');
var PredefinedAScheme = mongoose.Schema({
    uid : Number,
    cid : String,
    qid : String,
    category : String,
    type: String,
    question : String,
    command : String,
    answer : String,
    enabled : Boolean
  });
module.exports = PredefinedAScheme;