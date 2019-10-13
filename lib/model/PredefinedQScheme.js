var mongoose = require('mongoose');
var PredefinedQScheme = mongoose.Schema({
    cid : String,
    qid : String,
    Type: String,
    Question : String
  });
module.exports = PredefinedQScheme;