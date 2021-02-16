const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const redis = require('redis');

const client = redis.createClient();
const router = express.Router();

router.get('/get/user-data', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      db.collection('users').findOne({ id: req.user.id }, (error, result) => {
        if (error) {
          console.log(error);
        }
        db.close();
        const resObj = {};
        resObj.name = `${result.firstname} ${result.lastname}`;
        resObj.username = result.username;
        resObj.sex = result.sex;
        resObj.id = result.id;
        resObj.weight = result.weight;
        resObj.logins = result.logins;

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth();
        const yyyy = today.getFullYear();

        let api = result.api[`${dd}|${mm}|${yyyy}`];
        if (!api) {
          api = 0;
        }

        resObj.api = `${api} requests of ${config.dailyDarkSkyLimit} daily`;
        res.send(resObj);
      });
    });
  }
});

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

router.get('/get/metric-units', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else if (req.session.metricUnits !== undefined) {
    res.send(req.session.metricUnits);
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      db.collection('users').findOne({ id: req.user.id }, (error, result) => {
        if (error) {
          console.log(error);
        }
        db.close();
        if (result.metricUnits === undefined) {
          res.send(true);
        } else {
          res.send(result.metricUnits);
        }
      });
    });
  }
});

router.put('/put/reset-cache', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    client.keys(`*user=${req.user.id}*`, (err, keys) => {
      if (err) {
        res.send('fail');
        console.log(err);
      } else {
        res.send({ message: `Successfully deleted ${keys.length} records` });
        keys.forEach((key) => {
          client.del(key, () => {});
        });
      }
    });
  }
});

// Expects both settings to be supplemented in the query string
router.put('/put/update-settings', (req, res) => {
  if (!req.isAuthenticated() || req.query.ridesFilter === undefined || req.query.metricUnits === undefined) {
    res.redirect('/');
  } else {
    MongoClient.connect(config.mongoDBUrl, (err, db) => {
      const newVal = { $set: { ridesFilter: req.query.ridesFilter, metricUnits: req.query.metricUnits } };
      db.collection('users').updateOne({ id: req.user.id }, newVal, (error) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        res.send('success');
        db.close();
      });
    });
    req.session.metricUnits = req.query.metricUnits; // update session-wide metricUnits store
    req.session.save();
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
