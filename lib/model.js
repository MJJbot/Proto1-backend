var mongoose = require('mongoose');
var UserScheme = require('./model/UserScheme');
var CustomQAScheme = require('./model/CustomQAScheme');
var PredefinedQACommonScheme = require('./model/PredefinedQACommonScheme');
var PredefinedQAScheme = require('./model/PredefinedQAScheme');

module.exports = {
    User: mongoose.model('User', UserScheme),
    CustomQA: mongoose.model('CustomQA', CustomQAScheme),
    PredefinedQACommon: mongoose.model('PredefinedQACommon', PredefinedQACommonScheme),
    PredefinedQA: mongoose.model('PredefinedQA', PredefinedQAScheme)
}