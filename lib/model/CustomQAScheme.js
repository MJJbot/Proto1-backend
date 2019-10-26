var mongoose = require('mongoose');
var CustomQAScheme = mongoose.Schema({
    uid : String,
    id : String,
    question : String,
    command : String,
    answer : String,
    enabled : Boolean
  });
module.exports = CustomQAScheme;