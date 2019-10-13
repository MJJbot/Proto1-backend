var mongoose = require('mongoose');
var PredefinedCScheme = mongoose.Schema({
    cid : String,
    Category : String,
  });
module.exports = PredefinedCScheme;