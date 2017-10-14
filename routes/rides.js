const express = require('express');
const requestify = require('requestify');

const router = express.Router();

router.get('/details', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.send('This feature is coming soon!');
  }
});

router.get('/get/activities', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    requestify.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.accessToken}&per_page=200`).then((response) => {
      const activities = JSON.parse(response.body);
      res.send(activities);
    });
  }
});

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('rides', { title: 'Wind Analysis - Rides' });
  }
});

module.exports = router;
