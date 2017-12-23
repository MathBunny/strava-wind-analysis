const express = require('express');
const requestify = require('requestify');
const filters = require('../utilities/filters');

const router = express.Router();

router.get('/details', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.send('This feature is coming soon!');
  }
});

router.get('/get/activity', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else if (!req.query.id) {
    res.send({ error: 'error: did not provide id for activity' });
  } else {
    requestify.get(`https://www.strava.com/api/v3/activities/${req.query.id}?access_token=${req.user.accessToken}`).then((response) => {
      const activityDetails = JSON.parse(response.body);
      res.send(activityDetails);
    });
  }
});

router.get('/get/activities', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    requestify.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.accessToken}&per_page=200`).then((response) => {
      let activities = JSON.parse(response.body);
      if (req.query.filtered === 'true') {
        const filtersArr = req.query.filters.split('|');
        const filterMap = filters.getFilterMap();
        filtersArr.forEach((filter) => {
          const f = filterMap[filter];
          activities = activities.filter(x => f(x));
        });
      }
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
