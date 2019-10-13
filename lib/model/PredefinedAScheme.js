var mongoose = require('mongoose');
var PredefinedAScheme = mongoose.Schema({
    uid : Number,
    qid : String,
    Command : String,
    Answer : String,
    Active : Boolean
  });
module.exports = PredefinedAScheme;