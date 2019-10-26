// const cors = require('cors');
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const db = require('./lib/db');
const model = require('./lib/model');
const app = express();
const request = require('request')
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const isLogined = require('./lib/auth');
const shortid = require('shortid');
const clientOrigin = 'http://localhost:3000'

db.connect();

app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', clientOrigin);
	res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	res.header('Access-Control-Allow-Credentials', true);
	next();
  });
  
app.use(
	session({
		secret: '138j408h134',
		resave: true,
		saveUninitialized: false,
		store: new FileStore()
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// app.use(cors({
// 	credentials: true,
//   }))

var OAuth2Credentials = require('./config/credentials.json')
// OAuth2Credentials.claims = {
// 	"id_token": {
// 		"email": null,
// 		"email_verified": null
// 	}
// }

passport.use(new OAuth2Strategy(OAuth2Credentials, (accessToken, refreshToken, profile, done) => {
	console.log(accessToken, refreshToken, profile);
	const options = {
		headers: {
			Authorization: "Bearer " + accessToken
		},
		json: true
	}
	request('https://id.twitch.tv/oauth2/userinfo', options, (err, response, body) => {
		// { aud: 'hloghfav1xgxupcji8vz0ku6o0hyjz',
		//   exp: 1569330668,
		//   iat: 1569329768,
		//   iss: 'https://id.twitch.tv/oauth2',
		//   sub: '141044780',
		//   azp: 'hloghfav1xgxupcji8vz0ku6o0hyjz',
		//   preferred_username: 'C4tSi' }
		if (err) {
			done(null, false, {message: err})
		}
		var username = body.preferred_username;
		var uid = body.sub;
		var user = model.User.findOne({ uid: uid }, function(err, user){
			if (err || user == null) {
				var newUser = new model.User({
					uid: uid,
					username: username,
					accessToken: accessToken,
					refreshToken: refreshToken
				});
				newUser.save(function(err) {
					if (err) {
						console.error(err);
						done(null, false, {message: err});
					}
				});
				console.log(newUser);
				done(null, newUser)
			} else {
				console.log(user);
				done(null, user)
			}
		});
	})
}));

passport.serializeUser((user, done) => {
	//console.log('serializerUser. ' + user)
	done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
	//console.log('deserializeUser, ' + uid);
	var user = await db.findUserWithUID(uid);
	if (user){
		done(null, user)
	} else{
		done(null, false, {message: 'Failed to find user on DB'})
	}
});

app.get('/auth/oauth/twitch', passport.authenticate('oauth2'));
app.get('/auth/oauth/twitch/callback',
	passport.authenticate('oauth2', { failureRedirect: '/' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect(clientOrigin + '/dashboard');		
	});

app.get('/', (req, res) => {
	isLogined(req, res, () => {
		res.send('Logined');
	})
});

app.get('/api/user_session', (req, res) => {
	console.log("/customQA GET");
	isLogined(req, res, async () => {
		res.send({sessionValid: true});
	})
});

// CustomQA

app.get('/customQA', (req, res) => {
	console.log("/customQA GET");
	isLogined(req, res, async () => {
		try {
			var response = await db.getCustomQAResponseWithUID(req.user.uid);
			res.send(response);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.post('/customQA', (req, res) => {
	console.log("/customQA POST");
	isLogined(req, res, async () => {
		try {
			var result = await db.addCustomQAWithUID(req.user.uid, req.body.question, req.body.command, req.body.answer, req.body.enabled);
			if (result == false) {
				res.status(409).send("QA already exist");
			} else {
				var response = await db.getCustomQAResponseWithUID(req.user.uid);
				res.send(response);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.put('/customQA/:id', (req, res) => {
	console.log("/customQA PUT");
	isLogined(req, res, async () => {
		try {
			var result = await db.updateCustomQAWithUIDAndID(req.user.uid, req.params.id, req.body.question, req.body.command, req.body.answer, req.body.enabled);
			if (result == false) {
				res.status(404).send("QA not found");
			} else {
				var response = await db.getCustomQAResponseWithUID(req.user.uid);
				res.send(response);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.delete('/customQA/:id', (req, res) => {
	console.log("/customQA DELETE");
	isLogined(req, res, async () => {
		try {
			var result = await db.deleteCustomQAWithUIDAndID(req.user.uid, req.params.id);
			if (result == false) {
				res.status(404).send("QA not found");
			} else {
				var response = await db.getCustomQAResponseWithUID(req.user.uid);
				res.send(response);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

// PredefinedQA

app.get('/predefinedQA', (req, res) => {
	console.log("/predefinedQA GET");
	isLogined(req, res, async () => {
		try {
			var response = await db.getPredefinedQAResponseWithUID(req.user.uid);
			res.send(response);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.put('/predefinedQA/:qid', (req, res) => {
	console.log("/predefinedQA PUT");
	isLogined(req, res, async () => {
		try {
			var result = await db.updatePredefinedQAWithUIDAndQID(req.user.uid, req.params.qid, req.body.answer, req.body.enabled);
			if (result == false) {
				res.status(404).send("QA not found");
			} else {
				var response = await db.getPredefinedQAResponseWithUID(req.user.uid);
				res.send(response);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.delete('/predefinedQA/:qid', (req, res) => {
	console.log("/predefinedQA DELETE");
	isLogined(req, res, async () => {
		try {
			var result = await db.deletePredefinedQAWithUIDAndQID(req.user.uid, req.params.qid);
			if (result == false) {
				res.status(404).send("QA not found");
			} else {
				var response = await db.getPredefinedQAResponseWithUID(req.user.uid);
				res.send(response);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	})
});

app.listen(8893);

// Should add active funcionality
