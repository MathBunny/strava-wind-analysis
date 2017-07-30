var express = require('express');
var router = express.Router();

const passport = require('passport');
var StravaStrategy = require('passport-strava').Strategy;

router.get('/', passport.authenticate('strava', { scope: ['public'] }),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  });

router.get('/callback', 
    passport.authenticate('strava', { failureRedirect: '/login' }),
    function(req, res) {
        console.log(req.user.accessToken);
        res.redirect('/');
});

module.exports = router;