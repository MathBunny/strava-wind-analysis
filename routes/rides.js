const express = require('express');
const requestify = require('requestify');
const filters = require('../utilities/filters');
const config = require('../config');

const router = express.Router();
const cache = require('express-redis-cache')();

router.get('/details', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.send('This feature is coming soon!');
  }
});

router.get('/get/activity', (req, res, next) => {
  res.express_redis_cache_name = `rides/get/activity?user=${req.user.id}&activity=${req.query.id}`;
  next();
}, cache.route(), (req, res) => {
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

router.get('/get/activities', (req, res, next) => {
  res.express_redis_cache_name = `rides/get/activities?user=${req.user.id}&filters=${req.query.filters === undefined ? '' : req.query.filters}`;
  next();
}, cache.route({ expire: config.defaultExpirationTime }), (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    requestify.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.accessToken}&per_page=200`).then((response) => {
      let activities = JSON.parse(response.body);
      if (req.query.filtered === 'true') {
        const filtersArr = req.query.filters.split('|');
        const filterMap = filters.getFilterMap();
        filtersArr.forEach((filter) => {
          if (filterMap[filter] !== undefined) {
            const f = filterMap[filter];
            activities = activities.filter((x) => {
              const activity = x;
              activity.speed = (activity.distance * 3.6) / activity.moving_time;
              return f(activity);
            });
          }
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
