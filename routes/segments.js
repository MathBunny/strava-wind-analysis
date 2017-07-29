var express = require('express');
var router = express.Router();
const passport = require('passport');
const requestify = require('requestify');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    //console.log(req.user);
    requestify.get('https://www.strava.com/api/v3/athlete/friends')
    .then(function(response) {
        console.log(response.body); // Some code between 200-299 
    })
    .fail(function(response) {
        console.log("Error -- " + response.getCode()); // Some error code such as, for example, 404 
    });
    console.log("OK");
    res.render('segments', {title: 'Wind Analysis - Segments'});
  }
});

module.exports = router;