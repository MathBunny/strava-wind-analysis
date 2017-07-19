var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()){
    res.send("You're OP!");
  }
  else{
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
