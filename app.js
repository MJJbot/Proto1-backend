// const cors = require('cors');
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const db = require('./lib/db')
const app = express();
const request = require('request')
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const isLogined = require('./lib/auth');
const shortid = require('shortid');
const clientOrigin = 'http://localhost:8080'

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
		var user = db.get('users').find({ uid: uid }).value()
		if (user) {
			done(null, user)
		} else {
			user = {
				uid: uid,
				username: username,
				accessToken: accessToken,
				refreshToken: refreshToken
			}
			var customQA = {
				uid: uid,
				data: []
			}
			db.get('users').push(user).write()
			db.get('customQA').push(customQA).write()
			done(null, user)
		}
	})
}));

passport.serializeUser((user, done) => {
	console.log('serializerUser. ' + JSON.stringify(user))
	done(null, user.uid);
});

passport.deserializeUser((uid, done) => {
	console.log('deserializeUser, ' + uid);
	var user = db.get('users').find({uid:uid}).value()
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
	}, () => {
		var user_data = db.get('customQA').find({uid:"141044780"}).value()
		console.log('user_data1: ' + JSON.stringify(user_data))
		var query_data = user_data.data.find(u => u.id === "BQVaLeGM")
		console.log('query_data: ' + JSON.stringify(query_data))
		if (!query_data){
			// error
			console.log('customQA put: no id')
			res.send('customQA put: no id');
			return false
		} else{
			// edit data
			var new_data = {
				Question: "put_q",
				Command: "put_c",
				Answer: "put_a"
			}
			//new_data.id = query_data.id // or req.params.id
			user_data.data.find(u => u.id === "BQVaLeGM").Question = new_data.Question;
			user_data.data.find(u => u.id === "BQVaLeGM").Command = new_data.Command;
			user_data.data.find(u => u.id === "BQVaLeGM").Answer = new_data.Answer;
			console.log('user_data2:' + JSON.stringify(user_data));
			var res_data = db.get('customQA').find({uid:"141044780"}).assign(user_data).write()
			res.send(res_data.data)
			return false
		}


		// var user_data = db.get('customQA').find({uid:"141044780"}).value()
		// console.log('user_data1: ' + JSON.stringify(user_data))
		// var query_data = user_data.data.find(u => u.Question === "test2" || u.Command === '테스트1')
		// console.log('query_data: ' + JSON.stringify(query_data))
		// if (!query_data){
		// 	// write on db
		// 	var new_data = {
		// 		Question: "post_q",
		// 		Command: "post_c",
		// 		Answer: "post_a"
		// 	}
		// 	new_data.id = shortid.generate()
		// 	user_data.data.push(new_data)
		// 	console.log('user_data2: ' + JSON.stringify(user_data))
		// 	db.get('customQA').find({uid:"141044780"}).assign(user_data).write()
		// } else{
		// 	// response that it already exists
		// 	res.send('ae');
		// 	return false
		// }
		// console.log(db.get('customQA').find({uid:"141044780"}).value().data.find(u => u.Question === "test2" || u.Command === '테스트1'))
		// res.send('hi');
	})
});

app.get('/api/user_session', (req, res) => {
	isLogined(req, res, () => {
		console.log('user_session yes')
		var data = {
			sessionValid: true,
			userName: req.user.username
		}
		res.send(data);
		return true
	}, () => {
		console.log('user_session no')
		var data = {
			sessionValid: false
		}
		res.send(data);
		return false
	})
})

app.get('/customQA', (req, res) => {
	isLogined(req, res, () => {
		var data = {
			QAlist: db.get('customQA').find({uid:req.user.uid}).value().data
		}
		res.send(data);
	}, () => {
		//no implementation
	})
});

app.post('/customQA', (req, res) => {
	isLogined(req, res, () => {
		var user_data = db.get('customQA').find({uid:req.user.uid}).value()
		var query_data = user_data.data.find(u => u.Question === req.body.Question || u.Command === req.body.Command)
		if (!query_data){
			// write on db
			var new_data = req.body
			new_data.id = shortid.generate()
			user_data.data.push(new_data)
			var res_data = db.get('customQA').find({uid: req.user.uid}).assign(user_data).write()
			res.send(res_data.data)
			return true
		} else{
			// response that it already exists
			res.send('already exist');
			return false
		}
	}, () => {
		//not logined
		res.redirect(origin + '/')
		return false
	})
});

app.put('/customQA/:id', (req, res) => {
	isLogined(req, res, () => {
		var user_data = db.get('customQA').find({uid:req.user.uid}).value()
		var query_data = user_data.data.find(u => u.id ===req.params.id)
		if (!query_data){
			// error
			console.log('customQA put: no id')
			res.send('customQA put: no id');
			return false
		} else{
			// edit data
			var new_data = req.body
			user_data.data.find(u => u.id === req.params.id).Question = new_data.Question;
			user_data.data.find(u => u.id === req.params.id).Command = new_data.Command;
			user_data.data.find(u => u.id === req.params.id).Answer = new_data.Answer;
			var res_data = db.get('customQA').find({uid: req.user.uid}).assign(user_data).write()
			res.send(res_data.data)
			return true
		}
	}, () => {
		//not logined
		res.redirect(origin + '/')
		return false
	})
});

app.listen(8893);