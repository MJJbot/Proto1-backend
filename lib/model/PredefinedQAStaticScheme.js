var mongoose = require('mongoose');
var PredefinedQAStaticScheme = mongoose.Schema({
    cid : Number,
    qid : Number,
    category : String,
    type: String,
    question : String,
    command : String,
  });
module.exports = PredefinedQAStaticScheme;