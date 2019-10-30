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

var findUserAndRefreshBotEnabledWithUID = async function(uid) {
   var user = await model.User.findOne({uid: uid});
   if (user) {
      //console.log('user: ', user);
   } else {
      console.log('user with ', uid, ' is not in DB\n');
      return null;
   }
   
   if ((Date.now() - user.botEnabledCheck) / 1000 <= 5 * 60) { // 5 minutes
      // SHOULD Refresh bot enabled status and update database
      user.botEnabledCheck = Date.now();
      await user.save();
      return user;
   } else {
      return user;
   }
}

var updateUserBotEnabledWithUID = async function(uid, botEnabled) {
   var result = await model.User.updateOne({uid: uid}, {
      botEnabled: botEnabled,
      botEnabledCheck: Date.now()
   });

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
}

var getDashboardResponseWithUID = async function(uid) {
   var user = await findUserAndRefreshBotEnabledWithUID(uid);

   var response = {
      userName: user.userName,
      userImg: user.userImg,
      botEnabled: user.botEnabled
   };

   console.log(response);

   return response;
}

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
      userName: user.userName,
      userImg: user.userImg,
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
   var predefinedQAStatics = await model.PredefinedQAStatic.find({cid: cid});
   if (predefinedQAStatics.length > 0) {
      console.log('predefinedQAStatics: ', predefinedQAStatics);
   } else {
      console.log('predefinedQAStatic with ', cid, ' is not in DB');
   }
   return predefinedQAStatics;
}

var updatePredefinedQAWithUIDAndQID = async function(uid, qid, answer, enabled) {
   if (answer.length == 0) {
      return await deletePredefinedQAWithUIDAndQID(uid, qid);
   }

   var predefinedQA = await model.PredefinedQA.findOne({uid: uid, qid: qid});
   if (predefinedQA) {
      var result = await model.PredefinedQA.updateOne({uid: uid, qid: qid}, {
         answer: answer,
         enabled: enabled
      });
   
      console.log(result);
   
      if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
         return true;
      } else {
         return false;
      }
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
         if (result != null) { // Maybe distinguish ERROR and NOT EXIST
            return true;
         } else {
            return false;
         }
      } else {
         return false;
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
      userName: user.userName,
      userImg: user.userImg,
      CategoryList: predefinedQACategoryResponse,
      QAlist: predefinedQAResponses
   };

   console.log(response);

   return response;
};

// AutomaticQA

var findAutomaticQAsWithUID = async function(uid) {
   var automaticQAs = await model.AutomaticQA.find({uid: uid});
   if (automaticQAs.length > 0) {
      console.log('automaticQAs: ', automaticQAs);
   } else {
      console.log('automaticQA with ', uid, ' is not in DB');
   }
   return automaticQAs;
};

var getAutomaticQAStatics = async function() {
   var automaticQAStatics = await model.AutomaticQAStatic.find();
   if (automaticQAStatics.length > 0) {
      console.log('automaticQAStatics: ', automaticQAStatics);
   } else {
      console.log('automaticQAStatic is not in DB');
   }
   return automaticQAStatics;
};

var findAutomaticQAStaticWithQID = async function(qid) {
   var automaticQAStatic = await model.AutomaticQAStatic.findOne({qid: qid});
   if (automaticQAStatic) {
      console.log('automaticQAStatic: ', automaticQAStatic);
   } else {
      console.log('automaticQAStatic with ', qid, ' is not in DB');
   }
   return automaticQAStatic;
};

var findAutomaticQAStaticsWithQIDs = async function(qids) {
   var automaticQAStatics = await model.AutomaticQAStatic.find().in('qid', qids);
   if (automaticQAStatics.length > 0) {
      console.log('automaticQAStatics: ', automaticQAStatics);
   } else {
      console.log('automaticQAStatic with ', qids, ' is not in DB');
   }
   return automaticQAStatics;
};

var findAutomaticQAStaticsWithCID = async function(cid) {
   var automaticQAStatics = await model.AutomaticQAStatic.find({cid: cid});
   if (automaticQAStatics.length > 0) {
      console.log('automaticQAStatics: ', automaticQAStatics);
   } else {
      console.log('automaticQAStatic with ', cid, ' is not in DB');
   }
   return automaticQAStatics;
}

var updateAutomaticQAWithUIDAndQID = async function(uid, qid, answer, enabled) {
   if (answer.length == 0) {
      return await deleteAutomaticQAWithUIDAndQID(uid, qid);
   }

   var automaticQA = await model.AutomaticQA.findOne({uid: uid, qid: qid});
   if (automaticQA) {
      var result = await model.AutomaticQA.updateOne({uid: uid, qid: qid}, {
         answer: answer,
         enabled: enabled
      });
   
      console.log(result);
   
      if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
         return true;
      } else {
         return false;
      }
   } else {
      var automaticQAStatic = await findAutomaticQAStaticWithQID(qid);
      if (automaticQAStatic) {
         var result = await model.AutomaticQA.create({
            uid: uid,
            cid: automaticQAStatic.cid,
            qid: automaticQAStatic.qid,
            category: automaticQAStatic.category,
            type: automaticQAStatic.type,
            question: automaticQAStatic.question,
            command: automaticQAStatic.command,
            answer: answer,
            enabled: enabled,
            parameter: automaticQAStatic.parameter
         });
   
         // Should inspect success / fail check
         if (result != null) { // Maybe distinguish ERROR and NOT EXIST
            return true;
         } else {
            return false;
         }
      } else {
         return false;
      }
   }
};

var deleteAutomaticQAWithUIDAndQID = async function(uid, qid) {
   var result = await model.AutomaticQA.deleteOne({uid: uid, qid: qid});

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

var getAutomaticQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var automaticQAs = await findAutomaticQAsWithUID(uid);
   var automaticQAStatics = await getAutomaticQAStatics();
   var automaticQAs_hash = {}
   var automaticQAResponses = [];
   var automaticQACategory_hash = {};
   var automaticQACategoryResponse = [];

   automaticQAs.forEach(function(automaticQA) {
      automaticQAs_hash[automaticQA.qid] = automaticQA;
   });

   automaticQAStatics.forEach(function(automaticQAStatic) {
      automaticQACategory_hash[automaticQAStatic.category] = {
         cid: automaticQAStatic.cid,
         category: automaticQAStatic.category
      };

      if (automaticQAStatic.qid in automaticQAs_hash) {
         // Answer exist
         automaticQAResponses.push(automaticQAs_hash[automaticQAStatic.qid]);
      } else {
         // Answer not exist
         automaticQAResponses.push({
            uid : uid,
            cid : automaticQAStatic.cid,
            qid : automaticQAStatic.qid,
            category : automaticQAStatic.category,
            type: automaticQAStatic.type,
            question : automaticQAStatic.question,
            command : automaticQAStatic.command,
            answer : automaticQAStatic.answer,
            enabled : false,
            parameter: automaticQAStatic.parameter
         });
      }
   });

   Object.keys(automaticQACategory_hash).forEach(function(key) {
      automaticQACategoryResponse.push(automaticQACategory_hash[key]);
   });

   var response = {
      userName: user.userName,
      userImg: user.userImg,
      CategoryList: automaticQACategoryResponse,
      QAlist: automaticQAResponses
   };

   console.log(response);

   return response;
};

module.exports = {
   connect: connect,

   findUserWithUID: findUserWithUID,
   findUserAndRefreshBotEnabledWithUID: findUserAndRefreshBotEnabledWithUID,
   updateUserBotEnabledWithUID: updateUserBotEnabledWithUID,
   getDashboardResponseWithUID: getDashboardResponseWithUID,

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

   findAutomaticQAsWithUID: findAutomaticQAsWithUID,
   getAutomaticQAStatics: getAutomaticQAStatics,
   findAutomaticQAStaticWithQID: findAutomaticQAStaticWithQID,
   findAutomaticQAStaticsWithQIDs: findAutomaticQAStaticsWithQIDs,
   findAutomaticQAStaticsWithCID: findAutomaticQAStaticsWithCID,
   updateAutomaticQAWithUIDAndQID: updateAutomaticQAWithUIDAndQID,
   deleteAutomaticQAWithUIDAndQID: deleteAutomaticQAWithUIDAndQID,
   getAutomaticQAResponseWithUID: getAutomaticQAResponseWithUID,
}