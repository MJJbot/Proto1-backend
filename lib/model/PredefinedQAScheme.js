var mongoose = require('mongoose');
var PredefinedQAScheme = mongoose.Schema({
    uid : Number,
    cid : Number,
    qid : Number,
    category : String,
    type: String,
    question : String,
    command : String,
    answer : String,
    enabled : Boolean
  });
module.exports = PredefinedQAScheme;