var mongoose = require('mongoose');
var UserScheme = mongoose.Schema({
    uid : Number,
    username : String,
    accessToken : String,
    refreshToken : String,
    botEnabled : Boolean,
    botEnabledCheck : Date
  });
module.exports = UserScheme;