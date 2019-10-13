var mongoose = require('mongoose');
var UserScheme = require('./model/UserScheme');
var CustomQAScheme = require('./model/CustomQAScheme');
var PredefinedCScheme = require('./model/PredefinedCScheme');
var PredefinedQScheme = require('./model/PredefinedQScheme');
var PredefinedAScheme = require('./model/PredefinedAScheme');

module.exports = {
    User: mongoose.model('User', UserScheme),
    CustomQA: mongoose.model('CustomQA', CustomQAScheme),
    PredefinedC: mongoose.model('PredefinedC', PredefinedCScheme),
    PredefinedQ: mongoose.model('PredefinedQ', PredefinedQScheme),
    PredefinedA: mongoose.model('PredefinedA', PredefinedAScheme)
}