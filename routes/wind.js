const express = require('express');
const requestify = require('requestify');
const config = require('../config');
const geography = require('../utilities/geography');
const Vector = require('../utilities/vector');

const router = express.Router();

router.get('/get/wind-data', (req, res) => {
  const darkskyrequest = `https://api.forecast.io/forecast/${config.weatherKey}/${req.query.latitude},${req.query.longitude},${req.query.start_date_iso}?units=ca`;
  requestify.get(darkskyrequest).then((windDataResponse) => {
    const windData = JSON.parse(windDataResponse.body);
    const date = new Date(req.query.start_date_iso);

    const responseObj = {};

    responseObj.wind_speed = windData.hourly.data[date.getHours()].windSpeed;
    responseObj.wind_speed_str = responseObj.wind_speed.toFixed(2);

    responseObj.wind_bearing = windData.hourly.data[date.getHours()].windBearing;
    responseObj.wind_bearing_str = geography.degreesToCardinal(responseObj.wind_bearing);
    responseObj.ride_bearing_str = geography.convertLatLongToCardinal(req.query.end_lat,
      req.query.end_long, req.query.start_lat, req.query.start_long);

    try {
      const windVector = new Vector(-Vector.getLatitudeFromBearing(responseObj.wind_bearing),
        -Vector.getLongitudeFromBearing(responseObj.wind_bearing));
      const segmentVector = new Vector(parseFloat(req.query.latitude),
        parseFloat(req.query.longitude));
      const roundoffValue = 1 - Vector.getDistance(windVector, segmentVector);
      const speed = Vector.resultantSpeed(parseInt(responseObj.wind_speed, 0));
      responseObj.coefficient = speed * roundoffValue;
      responseObj.coefficient_str = (responseObj.coefficient).toFixed(2);
    } catch (e) {
      console.log(e);
    }
    res.send(responseObj);
  }).fail((err) => {
    res.render('error', { message: err.body, stack: ' Dark Sky API Error ', status: err.code });
    console.log(err);
  });
});

module.exports = router;
