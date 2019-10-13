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

var addCustomQAWithUID = async function(uid, question, command, answer) {
   var customQAs = await model.CustomQA.find().or([{uid: uid, Question: question}, {uid: uid, Command: command}]);
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

var findPredefinedAsWithUID = async function(uid) {
   var predefinedAs = await model.PredefinedA.find({uid: uid});
   if (predefinedAs.length > 0) {
      console.log('predefinedAs: ', predefinedAs);
   } else {
      console.log('predefinedA with ', uid, ' is not in DB');
   }
   return predefinedAs;
};

var getPredefinedQs = async function() {
   var predefinedQs = await model.PredefinedQ.find();
   if (predefinedQs.length > 0) {
      console.log('predefinedQs: ', predefinedQs);
   } else {
      console.log('predefinedQ is not in DB');
   }
   return predefinedQs;
};

var findPredefinedQWithQID = async function(qid) {
   var predefinedQ = await model.PredefinedQ.findOne({qid: qid});
   if (predefinedQ) {
      console.log('predefinedQ: ', predefinedQ);
   } else {
      console.log('predefinedQ with ', qid, ' is not in DB');
   }
   return predefinedQ;
};

var findPredefinedQsWithQIDs = async function(qids) {
   var predefinedQs = await model.PredefinedQ.find().in('qid', qids);
   if (predefinedQs.length > 0) {
      console.log('predefinedQs: ', predefinedQs);
   } else {
      console.log('predefinedQ with ', qids, ' is not in DB');
   }
   return predefinedQs;
};

var getPredefinedCs = async function() {
   var predefinedCs = await model.PredefinedC.find();
   if (predefinedCs.length > 0) {
      console.log('predefinedCs: ', predefinedCs);
   } else {
      console.log('predefinedC with is not in DB');
   }
   return predefinedCs;
};

var findPredefinedCWithCID = async function(cid) {
   var predefinedC = await model.PredefinedC.findOne({cid: cid});
   if (predefinedC) {
      console.log('predefinedC: ', predefinedC);
   } else {
      console.log('predefinedC with ', cid, ' is not in DB');
   }
   return predefinedC;
};

var findPredefinedCsWithCIDs = async function(cids) {
   var predefinedCs = await model.PredefinedC.find().in('cid', cids);
   if (predefinedCs.length > 0) {
      console.log('predefinedCs: ', predefinedCs);
   } else {
      console.log('predefinedC with ', cids, ' is not in DB');
   }
   return predefinedCs;
};

var addPredefinedAWithUIDAndQID = async function(uid, qid, command, answer) {
   var customQAs = await model.CustomQA.find().or([{uid: uid, qid: qid}, {uid: uid, Command: command}]);
   if (customQAs.length > 0) {
      return false;
   } else {
      var newPredefinedA = new model.PredefinedA({
         uid: uid,
         qid: qid,
         Command: command,
         Answer: answer
      });
      await newPredefinedA.save();
      return true;
   }
};

var updatePredefinedQAWithUIDAndQID = async function(uid, qid, command, answer) {
   var result = await model.CustomQA.updateOne({uid: uid, qid: qid}, {
      Command: command,
      Answer: answer
   });

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

var deletePredefinedQAWithUIDAndID = async function(uid, id) {
   var result = await model.PredefinedA.deleteOne({uid: uid, id: id});

   console.log(result);

   if (result.ok == 1) { // Maybe distinguish ERROR and NOT EXIST
      return true;
   } else {
      return false;
   }
};

/*
var getPredefinedQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var predefinedAs = await findPredefinedAsWithUID(uid);
   var qids = predefinedAs.map(a => a.qid);
   var predefinedQs = await findPredefinedQsWithQIDs(qids);
   var cids = predefinedQs.map(q => q.cid);
   var predefinedCs = await findPredefinedCsWithCIDs(cids);
   var predefinedQs_hash = {}
   var predefinedCs_hash = {}
   var predefinedQAs = [];

   predefinedQs.forEach(function(predefinedQ) {
      predefinedQs_hash[predefinedQ.qid] = predefinedQ;
   });

   predefinedCs.forEach(function(predefinedC) {
      predefinedCs_hash[predefinedC.cid] = predefinedC;
   });

   predefinedAs.forEach(function(predefinedA) {
      if (predefinedA.qid in predefinedQs_hash) {
         var predefinedQ = predefinedQs_hash[predefinedA.qid];
         if (predefinedQ.cid in predefinedCs_hash) {
            var predefinedC = predefinedCs_hash[predefinedQ.cid];

            predefinedQAs.push({
               cid: predefinedC.cid,
               cname: predefinedC.cname,
               qid: predefinedQ.qid,
               Question: predefinedQ.Question,
               Command: predefinedA.Command,
               Answer: predefinedA.Answer,
               Active: predefinedA.Active
            });
         } else {
            throw "Category is not in DB";
         }
      } else {
         throw "Question is not in DB";
      }
   });

   var response = {
      userName: user.username,
      //userImg: user.userimg,
      QAlist: predefinedQAs
   };

   return response;
};*/

var getPredefinedQAResponseWithUID = async function(uid) {
   var user = await findUserWithUID(uid);
   var predefinedAs = await findPredefinedAsWithUID(uid);
   var predefinedQs = await getPredefinedQs();
   var predefinedCs = await getPredefinedCs();
   var predefinedAs_hash = {}
   var predefinedCs_hash = {}
   var predefinedQAs = [];

   predefinedAs.forEach(function(predefinedA) {
      predefinedAs_hash[predefinedA.qid] = predefinedA;
   });

   predefinedCs.forEach(function(predefinedC) {
      predefinedCs_hash[predefinedC.cid] = predefinedC;
   });

   predefinedQs.forEach(function(predefinedQ) {
      if (predefinedQ.cid in predefinedCs_hash) {
         var predefinedC = predefinedCs_hash[predefinedQ.cid];

         if (predefinedQ.qid in predefinedAs_hash) {
            var predefinedA = predefinedAs_hash[predefinedQ.qid];

            // Answer not exist
            predefinedQAs.push({
               cid: predefinedC.cid,
               Category: predefinedC.Category,
               qid: predefinedQ.qid,
               Type: predefinedQ.Type,
               Question: predefinedQ.Question,
               Command: predefinedA.Command,
               Answer: predefinedA.Answer,
               Active: predefinedA.Active
            });
         } else {
            // Answer exist
            predefinedQAs.push({
               cid: predefinedC.cid,
               Category: predefinedC.Category,
               qid: predefinedQ.qid,
               Type: predefinedQ.Type,
               Question: predefinedQ.Question,
               Command: "",
               Answer: "",
               Active: false
            });
         }
      } else {
         throw "Category is not in DB";
      }
   });

   var response = {
      userName: user.username,
      //userImg: user.userimg,
      CategoryList: predefinedCs,
      QAlist: predefinedQAs
   };

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

   findPredefinedAsWithUID: findPredefinedAsWithUID,
   getPredefinedQs: getPredefinedQs,
   findPredefinedQWithQID: findPredefinedQWithQID,
   findPredefinedQsWithQIDs: findPredefinedQsWithQIDs,
   getPredefinedCs: getPredefinedCs,
   findPredefinedCWithCID: findPredefinedCWithCID,
   findPredefinedCsWithCIDs: findPredefinedCsWithCIDs,
   addPredefinedAWithUIDAndQID: addPredefinedAWithUIDAndQID,
   updatePredefinedQAWithUIDAndQID: updatePredefinedQAWithUIDAndQID,
   deletePredefinedQAWithUIDAndID: deletePredefinedQAWithUIDAndID,
   getPredefinedQAResponseWithUID: getPredefinedQAResponseWithUID,
}