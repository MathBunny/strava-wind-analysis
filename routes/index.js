var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  //console.log(req.user);
  if (!req.isAuthenticated()) {
    res.render('login', { title: 'Wind Analysis - Login' });
  }
  else {
    res.render('index', { title: 'Wind Analysis - Home' });
  }
});

module.exports = router;
