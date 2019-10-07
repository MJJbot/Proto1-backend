var mongoose = require('mongoose');
var UserScheme = require('./model/UserScheme');
var CustomQAScheme = require('./model/CustomQAScheme');
//var CustomQAItemScheme = require('./model/CustomQAItemScheme');

module.exports = {
    User: mongoose.model('User', UserScheme),
    CustomQA: mongoose.model('CustomQA', CustomQAScheme),
    //CustomQAItem: mongoose.model('CustomQAItem', CustomQAItemScheme)
}