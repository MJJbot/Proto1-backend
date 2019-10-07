/*var mongoose = require('mongoose');
var CustomQAItemScheme = require('./CustomQAItemScheme');
var CustomQAScheme = mongoose.Schema({
    uid : Number,
    data : [ CustomQAItemScheme ]
  });
module.exports = CustomQAScheme;*/

var mongoose = require('mongoose');
var CustomQAScheme = mongoose.Schema({
    uid : String,
    id : String,
    Question : String,
    Command : String,
    Answer : String
  });
module.exports = CustomQAScheme;