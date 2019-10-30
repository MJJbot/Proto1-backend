var mongoose = require('mongoose');
var UserScheme = require('./model/UserScheme');
var CustomQAScheme = require('./model/CustomQAScheme');
var PredefinedQAStaticScheme = require('./model/PredefinedQAStaticScheme');
var PredefinedQAScheme = require('./model/PredefinedQAScheme');
var AutomaticQAStaticScheme = require('./model/AutomaticQAStaticScheme');
var AutomaticQAScheme = require('./model/AutomaticQAScheme');
var RecommendQAScheme = require('./model/RecommendQAScheme');

module.exports = {
    User: mongoose.model('User', UserScheme),
    CustomQA: mongoose.model('CustomQA', CustomQAScheme),
    PredefinedQAStatic: mongoose.model('PredefinedQAStatic', PredefinedQAStaticScheme),
    PredefinedQA: mongoose.model('PredefinedQA', PredefinedQAScheme),
    AutomaticQAStatic: mongoose.model('AutomaticQAStatic', AutomaticQAStaticScheme),
    AutomaticQA: mongoose.model('AutomaticQA', AutomaticQAScheme),
    RecommendQA: mongoose.model('RecommendQA', RecommendQAScheme),
}