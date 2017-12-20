const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const login = require('./routes/login');
const logout = require('./routes/logout');
const segments = require('./routes/segments');
const charts = require('./routes/charts');
const rides = require('./routes/rides');
const wind = require('./routes/wind');
const settings = require('./routes/settings');
const legacy = require('./routes/legacy');
const passport = require('passport');
const StravaStrategy = require('passport-strava').Strategy;

const app = express();
let config = {};

try {
  config = require('./config.js'); // eslint-disable-line
} catch (e) { console.log('Configuration not found, resorting to ENV variables'); }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: false });

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new StravaStrategy({
  clientID: config.clientID || process.env.CLIENT_ID,
  clientSecret: config.clientSecret || process.env.CLIENT_SECRET,
  callbackURL: config.callbackURL || process.env.CALLBACK_URL || 'http://localhost:3000/login/callback',
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    const userProfile = profile;
    userProfile.accessToken = accessToken;
    return done(null, profile);
  });
}));

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/segments', segments);
app.use('/rides', rides);
app.use('/settings', settings);
app.use('/legacy', legacy);
app.use('/charts', charts);
app.use('/wind', wind);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = app;
