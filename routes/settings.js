const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

const router = express.Router();


router.get('/get/rides-filter', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      console.log(db);
      db.db(config.dbName).collection('users').findOne({ id: req.user.id }, (error, result) => {
        if (error) {
          console.log(error);
        }
        db.close();
        res.send(result);
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
