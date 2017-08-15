var express = require('express');
var router = express.Router();

const passport = require('passport');
var StravaStrategy = require('passport-strava').Strategy;

router.get('/', function (req, res, next) {
  req.logOut();
  res.redirect('../');
});

module.exports = router;