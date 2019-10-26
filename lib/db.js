const shortid = require('shortid');
var mongoose = require('mongoose');
var model = require('./model');
var url = 'mongodb://localhost:27017/mujinjang';

// DB

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

// User

var findUserWithUID = async function(uid) {
   var user = await model.User.findOne({uid: uid});
   if (user) {
      //console.log('user: ', user);
   } else {
      console.log('user with ', uid, ' is not in DB\n');
   }
   return user;
};

// CustomQA

var findCustomQAsWithUID = async function(uid) {
   var customQAs = await model.CustomQA.find({uid: uid});
   if (customQAs.length > 0) {
      console.log('customQA: ', customQAs);
   } else {
      console.log('customQA with ', uid, ' is not in DB');
   }
   return customQAs;
};

var addCustomQAWithUID = async function(uid, question, command, answer, enabled) {
   var customQAs = await model.CustomQA.find().or([{uid: uid, question: question}, {uid: uid, command: command}]);
   if (customQAs.length > 0) {
      return false;
   } else {
      var id = shortid.generate();
      var newCustomQA = new model.CustomQA({
         uid: uid,
         id: id,
         question: question,
         command: command,
         answer: answer,
         enabled: enabled
      });
      await newCustomQA.save();
      return true;
   }
};

var updateCustomQAWithUIDAndID = async function(uid, id, question, command, answer, enabled) {
   var result = await model.CustomQA.updateOne({uid: uid, id: id}, {
      question: question,
      command: command,
      answer: answer,
      enabled: enabled
   });

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

var deleteCustomQAWithUIDAndID = async function(uid, id) {
   var result = await model.CustomQA.deleteOne({uid: uid, id: id});

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

var getCustomQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var customQAs = await findCustomQAsWithUID(uid);

   var response = {
      userName: user.username,
      //userImg: user.userimg,
      QAlist: customQAs
   };

   return response;
};

// PredefinedQA

var findPredefinedQAsWithUID = async function(uid) {
   var predefinedQAs = await model.PredefinedQA.find({uid: uid});
   if (predefinedQAs.length > 0) {
      console.log('predefinedQAs: ', predefinedQAs);
   } else {
      console.log('predefinedQA with ', uid, ' is not in DB');
   }
   return predefinedQAs;
};

var getPredefinedQAStatics = async function() {
   var predefinedQAStatics = await model.PredefinedQAStatic.find();
   if (predefinedQAStatics.length > 0) {
      console.log('predefinedQAStatics: ', predefinedQAStatics);
   } else {
      console.log('predefinedQAStatic is not in DB');
   }
   return predefinedQAStatics;
};

var findPredefinedQAStaticWithQID = async function(qid) {
   var predefinedQAStatic = await model.PredefinedQAStatic.findOne({qid: qid});
   if (predefinedQAStatic) {
      console.log('predefinedQAStatic: ', predefinedQAStatic);
   } else {
      console.log('predefinedQAStatic with ', qid, ' is not in DB');
   }
   return predefinedQAStatic;
};

var findPredefinedQAStaticsWithQIDs = async function(qids) {
   var predefinedQAStatics = await model.PredefinedQAStatic.find().in('qid', qids);
   if (predefinedQAStatics.length > 0) {
      console.log('predefinedQAStatics: ', predefinedQAStatics);
   } else {
      console.log('predefinedQAStatic with ', qids, ' is not in DB');
   }
   return predefinedQAStatics;
};

var findPredefinedQAStaticsWithCID = async function(cid) {
   var predefinedQAStatics = await model.PredefinedQAStatic.findOne({cid: cid});
   if (predefinedQAStatics.length > 0) {
      console.log('predefinedQAStatics: ', predefinedQAStatics);
   } else {
      console.log('predefinedQAStatic with ', cid, ' is not in DB');
   }
   return predefinedQAStatics;
}

var updatePredefinedQAWithUIDAndQID = async function(uid, qid, answer, enabled) {
   var predefinedQA = await model.PredefinedQA.findOne({uid: uid, qid: qid});
   if (predefinedQA) {
      var result;
      if (answer.length == 0) {
         result = await model.PredefinedQA.deleteOne({uid: uid, qid: qid});
      } else {
         result = await model.PredefinedQA.updateOne({uid: uid, qid: qid}, {
            answer: answer,
            enabled: enabled
         });
      }
   
      console.log(result);
   
      if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
         return true;
      } else {
         return false;
      }
   } else {
      if (answer.length == 0) {
         return true;
      } else {
         var predefinedQAStatic = await findPredefinedQAStaticWithQID(qid);
         if (predefinedQAStatic) {
            var result = await model.PredefinedQA.create({
               uid: uid,
               cid: predefinedQAStatic.cid,
               qid: predefinedQAStatic.qid,
               category: predefinedQAStatic.category,
               type: predefinedQAStatic.type,
               question: predefinedQAStatic.question,
               command: predefinedQAStatic.command,
               answer: answer,
               enabled: enabled
            });
      
            // Should inspect success / fail check
            if (result) { // Maybe distinguish ERROR and NOT EXIST
               return false;
            } else {
               return true;
            }
         } else {
            return false;
         }
      }
   }
};

var deletePredefinedQAWithUIDAndQID = async function(uid, qid) {
   var result = await model.PredefinedQA.deleteOne({uid: uid, qid: qid});

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

var getPredefinedQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var predefinedQAs = await findPredefinedQAsWithUID(uid);
   var predefinedQAStatics = await getPredefinedQAStatics();
   var predefinedQAs_hash = {}
   var predefinedQAResponses = [];
   var predefinedQACategory_hash = {};
   var predefinedQACategoryResponse = [];

   predefinedQAs.forEach(function(predefinedQA) {
      predefinedQAs_hash[predefinedQA.qid] = predefinedQA;
   });

   predefinedQAStatics.forEach(function(predefinedQAStatic) {
      predefinedQACategory_hash[predefinedQAStatic.category] = {
         cid: predefinedQAStatic.cid,
         category: predefinedQAStatic.category
      };

      if (predefinedQAStatic.qid in predefinedQAs_hash) {
         // Answer exist
         predefinedQAResponses.push(predefinedQAs_hash[predefinedQAStatic.qid]);
      } else {
         // Answer not exist
         predefinedQAResponses.push({
            uid : uid,
            cid : predefinedQAStatic.cid,
            qid : predefinedQAStatic.qid,
            category : predefinedQAStatic.category,
            type: predefinedQAStatic.type,
            question : predefinedQAStatic.question,
            command : predefinedQAStatic.command,
            answer : "",
            enabled : false
         });
      }
   });

   Object.keys(predefinedQACategory_hash).forEach(function(key) {
      predefinedQACategoryResponse.push(predefinedQACategory_hash[key]);
   });

   var response = {
      userName: user.username,
      //userImg: user.userimg,
      CategoryList: predefinedQACategoryResponse,
      QAlist: predefinedQAResponses
   };

   console.log(response);

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

   findPredefinedQAsWithUID: findPredefinedQAsWithUID,
   getPredefinedQAStatics: getPredefinedQAStatics,
   findPredefinedQAStaticWithQID: findPredefinedQAStaticWithQID,
   findPredefinedQAStaticsWithQIDs: findPredefinedQAStaticsWithQIDs,
   findPredefinedQAStaticsWithCID: findPredefinedQAStaticsWithCID,
   updatePredefinedQAWithUIDAndQID: updatePredefinedQAWithUIDAndQID,
   deletePredefinedQAWithUIDAndQID: deletePredefinedQAWithUIDAndQID,
   getPredefinedQAResponseWithUID: getPredefinedQAResponseWithUID,
}