var mongoose = require('mongoose');
var UserScheme = require('./model/UserScheme');
var CustomQAScheme = require('./model/CustomQAScheme');
var PredefinedQAStaticScheme = require('./model/PredefinedQAStaticScheme');
var PredefinedQAScheme = require('./model/PredefinedQAScheme');

module.exports = {
    User: mongoose.model('User', UserScheme),
    CustomQA: mongoose.model('CustomQA', CustomQAScheme),
    PredefinedQAStatic: mongoose.model('PredefinedQAStatic', PredefinedQAStaticScheme),
    PredefinedQA: mongoose.model('PredefinedQA', PredefinedQAScheme)
}