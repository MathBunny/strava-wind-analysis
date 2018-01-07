const express = require('express');
const recommender = require('../data/recommender');
const stravadatahandler = require('../data/stravadatahandler');
const config = require('../config');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();
const cache = require('express-redis-cache')();

router.get('/get/segmentDetails', (req, res) => {
  stravadatahandler.getDetailedSegmentDetails(req.user.accessToken, req.query.segmentID).then((recommendations) => {
    res.send(recommendations);
  });
});

router.get('/get/recommendations', (req, res, next) => {
  res.express_redis_cache_name = `index/get/recommendations?user=${req.user.id}`;
  next();
}, cache.route({ expire: config.defaultExpirationTime }), (req, res) => {
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

    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      if (err) {
        console.log(err);
      }
      db.collection('users').findOne({ id: req.user.id }, (error, result) => {
        let logins = 0;
        if (result === null) {
          const newUserObj = req.user._json; // eslint-disable-line
          newUserObj.ridesFilter = false;
          newUserObj.logins = 0;
          newUserObj.api = {};
          
          db.collection('users').insertOne(newUserObj, () => {
          });
        } else if (result.logins !== undefined) {
          logins = result.logins;
        }
        const newVal = { $set: { logins: logins + 1 } };
        db.collection('users').updateOne({ id: req.user.id }, newVal, () => {
          db.close();
        });
      });
    });
  }
});

module.exports = router;
