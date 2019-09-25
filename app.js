// const cors = require('cors');
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const db = require('./lib/db')
const app = express();
const request = require('request')
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const isLogined = require('./lib/auth')

app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
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

// app.use(cors({
// 	credentials: true,
//   }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

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
			db.get('users').push(user).write()
			done(null, user)
		}
	})
}));

passport.serializeUser((user, done) => {
	console.log('serializerUser. ' + user)
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
		res.redirect('http://localhost:8080/dashboard');		
	});

app.get('/', (req, res) => {
	isLogined(req, res, () => {
		res.send('Logined');
	})
});

app.get('/customQA', (req, res) => {
	isLogined(req, res, () => {
		res.send(db.get('customQA').find({uid:req.user.uid}).value().data);
	}, () => {
		//no implementation
	})
});

app.listen(8893);