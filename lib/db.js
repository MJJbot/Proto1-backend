const shortid = require('shortid');
var mongoose = require('mongoose');
var model = require('./model');
var url = 'mongodb://localhost:27017/mujinjang';

var connect = function() {
   mongoose.connect(url, {useNewUrlParser: true});
   
   var db = mongoose.connection;
   db.on('error', function(err) {
      console.log('Error : ', err);
   });
   db.once('open', function() {
      console.log('DB Connected');
   });

   return db;
};

var findUserWithUID = async function(uid) {
   var user = await model.User.findOne({uid: uid});
   if (user) {
      console.log('user: ', user);
   } else {
      console.log('user with ', uid, ' is not in DB\n');
   }
   return user;
};

var findCustomQAsWithUID = async function(uid) {
   var customQAs = await model.CustomQA.find({uid: uid});
   if (customQAs.length > 0) {
      console.log('customQA: ', customQAs);
   } else {
      console.log('customQA with ', uid, ' is not in DB');
   }
   return customQAs;
};

var addCustomQAWithUID = async function(uid, question, command, answer) {
   var customQAs = await model.CustomQA.find({$or: [{uid: uid, Question: question}, {uid: uid, Command: command}]});
   if (customQAs.length > 0) {
      return false;
   } else {
      var id = shortid.generate();
      var newCustomQA = new model.CustomQA({
         uid: uid,
         id: id,
         Question: question,
         Command: command,
         Answer: answer
      });
      await newCustomQA.save();
      return true;
   }
};

var updateCustomQAWithUIDAndID = async function(uid, id, question, command, answer) {
   var result = await model.CustomQA.updateOne({uid: uid, id: id}, {
      Question: question,
      Command: command,
      Answer: answer
   });

   console.log(result);

   // PLEASE IMPLEMENT RESULT CHECK (SUCCESS / FAIL)

   return true;
};

var deleteCustomQAWithUIDAndID = async function(uid, id) {
   var result = await model.CustomQA.deleteOne({uid: uid, id: id});

   console.log(result);

   // PLEASE IMPLEMENT RESULT CHECK (SUCCESS / FAIL)

   return true;
};

var getCustomQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var customQAs = await findCustomQAsWithUID(uid);

   var response = {
      userName: user.username,
      //userImg: user.userimg,
      QAlist: customQAs
   }

   return response;
};

module.exports = {
   connect: connect,
   findUserWithUID: findUserWithUID,
   findCustomQAsWithUID: findCustomQAsWithUID,
   addCustomQAWithUID: addCustomQAWithUID,
   updateCustomQAWithUIDAndID: updateCustomQAWithUIDAndID,
   deleteCustomQAWithUIDAndID: deleteCustomQAWithUIDAndID,
   getCustomQAResponseWithUID: getCustomQAResponseWithUID,
}