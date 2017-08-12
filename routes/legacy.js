var express = require('express');
var router = express.Router();
const passport = require('passport');
const requestify = require('requestify');
const config = require('../config');

router.get('', (req, res) => {
  res.send('../public/legacy/index.html');
});


router.get('/get/leaderboard', (req, res) => {
    let accessToken = req.query.accessToken || config.accessToken;
    let segmentID = req.query.segmentID;
    requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "/leaderboard?&access_token=" + accessToken + "").then(response => {
        res.send(JSON.parse(response.body));
    }).fail(err => {
        console.log(err);
        res.send({});
    });
});

router.get('/get/location', (req, res) => {
  let accessToken = req.query.accessToken || config.accessToken;
  let segmentID = req.query.segmentID;
  requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "?access_token=" + accessToken).then(response => {
    res.send(JSON.parse(response.body));
  }).fail(err => {
      console.log(err);
      res.send({});
  });
});


router.get('/get/wind-data', (req, res) => {
  let lat = req.query.lat;
  let long = req.query.long;
  let time = req.query.time;
  let weatherKey = config.weatherKey;
  requestify.get('https://api.forecast.io/forecast/' + weatherKey + '/' + lat + ',' + long + ',' + time + '?units=ca').then(response => {
    res.send(JSON.parse(response.body));
  }).fail(err => {
    console.log(err);
    res.send({});  
  });
});

module.exports = router;