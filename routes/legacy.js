const express = require('express');
const requestify = require('requestify');
const config = require('../config');

const router = express.Router();

router.get('', (req, res) => {
  res.send('../public/legacy/index.html');
});

router.get('/get/leaderboard', (req, res) => {
  const accessToken = req.query.accessToken || config.accessToken;
  const segmentID = req.query.segmentID;
  requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/leaderboard?&access_token=${accessToken}`).then((response) => {
    res.send(JSON.parse(response.body));
  }).fail((err) => {
    res.send({}.err = err);
  });
});

router.get('/get/location', (req, res) => {
  const accessToken = req.query.accessToken || config.accessToken;
  const segmentID = req.query.segmentID;
  requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}?access_token=${accessToken}`).then((response) => {
    res.send(JSON.parse(response.body));
  }).fail((err) => {
    res.send({}.err = err);
  });
});

router.get('/get/wind-data', (req, res) => {
  const lat = req.query.lat;
  const long = req.query.long;
  const time = req.query.time;
  const weatherKey = config.weatherKey;
  requestify.get(`https://api.forecast.io/forecast/${weatherKey}/${lat},${long},${time}?units=ca`).then((response) => {
    res.send(JSON.parse(response.body));
  }).fail((err) => {
    console.log(err); // eslint-disable-line no-console
    res.send({ error: 'Weather API Limits Exceeded' });
  });
});

module.exports = router;
