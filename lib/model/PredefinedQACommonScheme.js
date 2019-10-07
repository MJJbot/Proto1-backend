var mongoose = require('mongoose');
var PredefinedQACommonScheme = mongoose.Schema({
    qid : String,
    Question : String,
    Command : String
  });
module.exports = PredefinedQACommonScheme;