var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    res.render('segments', {title: 'Wind Analysis - Segments'});
  }
});

module.exports = router;