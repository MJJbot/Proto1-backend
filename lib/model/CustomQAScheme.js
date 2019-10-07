var mongoose = require('mongoose');
var CustomQAScheme = mongoose.Schema({
    uid : String,
    id : String,
    Question : String,
    Command : String,
    Answer : String
  });
module.exports = CustomQAScheme;