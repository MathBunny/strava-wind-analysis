const express = require('express');
const recommender = require('../data/recommender');
const stravadatahandler = require('../data/stravadatahandler');

const router = express.Router();

router.get('/get/segmentDetails', (req, res) => {
  stravadatahandler.getDetailedSegmentDetails(req.user.accessToken, req.query.segmentID).then((recommendations) => {
    res.send(recommendations);
  });
});

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
    res.render('index', { title: 'Wind Analysis - Home', accessToken: req.user.accessToken });
  }
});

module.exports = router;
