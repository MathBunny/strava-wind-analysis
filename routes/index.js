const express = require('express');
const recommender = require('../data/recommender');

const router = express.Router();

router.get('/get/recommendations', (req, res) => {
  recommender.getSegmentRecommendations(req.user.accessToken).then((recommendations) => {
    res.send(recommendations);
  });
});

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('login', { title: 'Wind Analysis - Login' });
  } else {
    res.render('index', { title: 'Wind Analysis - Home' });
  }
});

module.exports = router;
