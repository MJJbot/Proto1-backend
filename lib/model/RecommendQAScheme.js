var mongoose = require('mongoose');
var RecommendQAScheme = mongoose.Schema({
    uid : Number,
    id : String,
    questionRep : String,
    questionList : [{name: String, question: String}],
    donationMoney : Number
  });
module.exports = RecommendQAScheme;