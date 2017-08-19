const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('login', { title: 'Wind Analysis - Login' });
  } else {
    res.render('index', { title: 'Wind Analysis - Home' });
  }
});

module.exports = router;
