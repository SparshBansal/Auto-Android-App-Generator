var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require("express-session")({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
});

var passport = require('passport');
var LocalStrategy = require('passport-local');
var authenticate = require('./authentication');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');

var createApp = require('./routes/createApp');


var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable mongoose
mongoose.connect('mongodb://localhost:27017/aapgDb');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session);

//===================PASSPORT=========================
passport.use('local-login',new LocalStrategy({usernameField : 'email',passwordField : 'password'},
	function(username,password,done){
		authenticate.localAuth(username,password).then(function(result){
			if(!result){
				console.log("Could not login!!");
				done(null,result);
			}
			if(result){
				console.log("Suucessfully logged in!!!");
				done(null,result);
			}
		}).catch(function(error){
			console.log(error.body);
	});
}));

passport.use('local-signup',new LocalStrategy({passReqToCallback : true , usernameField : 'email' , passwordField : 'password'}	,
	function(req,username,password,done){

	var details = req.body;
	authenticate.localRegistration(details).then(function(result){
		if(!result){
			console.log("Could not register!!");
			done(null, result);
		}
		else{
			console.log("Successfully registered!!");
			done(null,result);
		}
	}).catch(function(error){
		console.log(error.body);
	});

}));

passport.serializeUser(function(user,done){
	console.log("Serializing!!");
	done(null,user);
});

passport.deserializeUser(function(obj,done){
	console.log("Deserializing!!");
	done(null,obj);
});


app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/login',login);
app.use('/signup', signup);

app.use('/createApp',createApp);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
