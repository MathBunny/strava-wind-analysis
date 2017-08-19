const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('rides', { title: 'Wind Analysis - Rides' });
  }
});

module.exports = router;
