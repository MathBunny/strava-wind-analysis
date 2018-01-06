const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

const router = express.Router();


router.get('/get/rides-filter', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      db.collection('users').findOne({ id: req.user.id }, (error, result) => {
        if (error) {
          console.log(error);
        }
        db.close();
        if (result.ridesFilter === undefined) {
          res.send(false);
        } else {
          res.send(result.ridesFilter);
        }
      });
    });
  }
});

router.put('/put/rides-filter', (req, res) => {
  if (!req.isAuthenticated() || req.query.ridesFilter === undefined) {
    res.redirect('/');
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      const newVal = { $set: { ridesFilter: req.query.ridesFilter } };
      db.collection('users').updateOne({ id: req.user.id }, newVal, (error) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        res.send('success');
        db.close();
      });
    });
  }
});

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('settings', { title: 'Wind Analysis - Settings' });
  }
});

module.exports = router;
