var mongoose = require('mongoose');
var PredefinedQAScheme = mongoose.Schema({
    uid : uid,
    qid : String,
    Answer : String
  });
module.exports = PredefinedQAScheme;