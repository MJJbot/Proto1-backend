var mongoose = require('mongoose');
var UserScheme = mongoose.Schema({
    uid : Number,
    username : String,
    accessToken : String,
    refreshToken : String
  });
module.exports = UserScheme;