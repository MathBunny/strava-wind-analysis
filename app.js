var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var segments = require('./routes/segments');
var rides = require('./routes/rides');
var settings = require('./routes/settings');
var legacy = require('./routes/legacy');

const passport = require('passport');
var StravaStrategy = require('passport-strava').Strategy;

var app = express();
let config = {};

try {
  config = require('./config.js');
} catch (e) { console.log("Configuration not found, resorting to ENV variables") }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: false });

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new StravaStrategy({
  clientID: config.clientID || process.env.CLIENT_ID,
  clientSecret: config.clientSecret || process.env.CLIENT_SECRET,
  callbackURL: config.callbackURL || process.env.CALLBACK_URL || "http://localhost:3000/login/callback"
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      profile.accessToken = accessToken;
      return done(null, profile);
    });
  }));

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/logout', logout);
app.use('/segments', segments);
app.use('/rides', rides);
app.use('/settings', settings);
app.use('/legacy', legacy);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = app;
