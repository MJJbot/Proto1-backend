var mongoose = require('mongoose');
var UserScheme = mongoose.Schema({
    uid : Number,
    userName : String,
    userImg : String,
    userLogin : String,
    accessToken : String,
    refreshToken : String,
    botEnabled : Boolean,
    botEnabledCheck : Date
  });
module.exports = UserScheme;