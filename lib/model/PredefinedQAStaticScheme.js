var mongoose = require('mongoose');
var PredefinedQScheme = mongoose.Schema({
    cid : String,
    qid : String,
    category : String,
    type: String,
    question : String,
    command : String,
  });
module.exports = PredefinedQScheme;