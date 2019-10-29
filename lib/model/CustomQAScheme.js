var mongoose = require('mongoose');
var CustomQAScheme = mongoose.Schema({
    uid : Number,
    id : String,
    question : String,
    command : String,
    answer : String,
    enabled : Boolean
  });
module.exports = CustomQAScheme;