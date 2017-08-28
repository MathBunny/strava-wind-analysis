const express = require('express');
const requestify = require('requestify');
const geographyHelper = require('../utilities/geographyHelper');
const Vector = require('../utilities/vector');

const router = express.Router();
let segmentIDs = new Set();

router.get('/get/activity', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    const activityID = req.query.activityID;
    requestify.get(`https://www.strava.com/api/v3/activities/${activityID}?access_token=${req.user.accessToken}`).then((activityDetailsResponse) => {
      const activityDetails = JSON.parse(activityDetailsResponse.body);
      const segments = [];
      activityDetails.segment_efforts.forEach((segment) => {
        let prRank = segment.pr_rank;
        if (prRank === 1) {
          prRank = (req.user._json.sex === 'M' ? 'KOM' : 'QOM'); // eslint-disable-line no-underscore-dangle
        }
        const segmentData = segment.segment;
        if (!segmentIDs.has(segmentData.id) && !segmentIDs.has(segmentData.name)) {
          segmentIDs.add(segmentData.id);
          segmentIDs.add(segmentData.name);
          if (segmentData.name.length > 35) {
            segmentData.name = `${segmentData.name.substring(0, 32)}...`;
          }
          segments.push({ name: segmentData.name,
            id: segmentData.id,
            distance: (segmentData.distance / 1000).toFixed(2),
            average_grade: segmentData.average_grade,
            maximum_grade: segmentData.maximum_grade,
            ranking: prRank,
            city: segmentData.city,
            province: segmentData.state,
            country: segmentData.country });
        }
      });
      res.send(segments);
    });
  }
});

router.get('/get/activities', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    segmentIDs = new Set();
    requestify.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.accessToken}`).then((response) => {
      const activities = JSON.parse(response.body);
      res.send(activities);
    });
  }
});

router.get('/legacy/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    segmentIDs = new Set();
    const segments = [];
    let count = 0;

    requestify.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.accessToken}`).then((response) => {
      const activities = JSON.parse(response.body);
      const target = activities.length;
      activities.forEach((activity) => {
        requestify.get(`https://www.strava.com/api/v3/activities/'${activity.id}?access_token=${req.user.accessToken}`).then((activityDetailsResponse) => {
          const activityDetails = JSON.parse(activityDetailsResponse.body);
          activityDetails.segment_efforts.forEach((segmentData) => {
            let segment = segmentData;
            let prRank = segment.pr_rank;
            if (prRank === 1) {
              prRank = (req.user._json.sex === 'M' ? 'KOM' : 'QOM'); // eslint-disable-line no-underscore-dangle
            }
            segment = segment.segment;
            if (!segmentIDs.has(segment.id) && !segmentIDs.has(segment.name)) {
              segmentIDs.add(segment.id);
              segmentIDs.add(segment.name);
              if (segment.name.length > 35) {
                segment.name = `${segment.name.substring(0, 32)}...`;
              }
              segments.push({ name: segment.name,
                id: segment.id,
                distance: (segment.distance / 1000).toFixed(2),
                average_grade: segment.average_grade,
                maximum_grade: segment.maximum_grade,
                ranking: prRank,
                city: segment.city,
                province: segment.state,
                country: segment.country });
            }
          });
          count += 1;
          if (count === target) {
            const data = {};
            data.segments = segments;
            res.render('segments', data);
          }
        });
      });
    });
  }
});

/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('segments', {});
  }
});

router.get('/details', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else if (req.query.id === undefined) {
    res.render('error', { message: 'No supplied segment id!' });
  } else {
    const leaderboard = [];
    const segmentID = req.query.id;
    requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}/leaderboard?&access_token=${req.user.accessToken}`).then((response) => {
      const leaderboardResponse = JSON.parse(response.body);
      leaderboardResponse.entries.forEach((effort) => {
        leaderboard.push(effort);
      });

      // Get segment information
      requestify.get(`https://www.strava.com/api/v3/segments/${segmentID}?&access_token=${req.user.accessToken}`).then((segmentResponse) => {
        const segmentData = JSON.parse(segmentResponse.body);
        segmentData.distance /= 1000;
        segmentData.distance = segmentData.distance.toFixed(2);
        segmentData.leaderboard = leaderboard;
        segmentData.participants = leaderboardResponse.entry_count;
        segmentData.leaderboardLink = `https://www.strava.com/segments/${segmentID}?filter=overall`;
        segmentData.latitude = segmentData.start_latlng[0];
        segmentData.longitude = segmentData.start_latlng[1];
        let polyline = '';
        for (let x = 0; x < segmentData.map.polyline.length; x += 1) {
          if (segmentData.map.polyline.charAt(x) !== '\\') {
            polyline += segmentData.map.polyline.charAt(x);
          } else {
            polyline += `\\${segmentData.map.polyline.charAt(x)}`;
          }
        }
        segmentData.map.polyline = polyline;

        let count = 0;
        segmentData.leaderboard.forEach((effortData) => {
          const effort = effortData;
          effort.start_date_iso = effort.start_date;
          effort.start_date = effort.start_date.substring(0, 10);
          if (effort.rank % 10 === 1) {
            effort.rank = `${effort.rank}st`;
          } else if (effort.rank % 10 === 2) {
            effort.rank = `${effort.rank}nd`;
          } else if (effort.rank % 10 === 3) {
            effort.rank = `${effort.rank}rd`;
          } else {
            effort.rank = `${effort.rank}th`;
          }
          effort.speed = `${(((effort.distance * 3.6) / effort.elapsed_time).toFixed(2))}km/h`;

          const darkskyrequest = `https://api.forecast.io/forecast/81c978e8db7b136e4bf3c8988c2d90a6/${segmentData.latitude},${segmentData.longitude},${effort.start_date_iso}?units=ca`;
          requestify.get(darkskyrequest).then((windDataResponse) => {
            const windData = JSON.parse(windDataResponse.body);
            const date = new Date(effort.start_date_iso);
            effort.wind_speed = windData.hourly.data[date.getHours()].windSpeed;
            effort.wind_speed_str = effort.wind_speed.toFixed(2);
            effort.wind_bearing = windData.hourly.data[date.getHours()].windBearing;
            effort.wind_bearing_str = geographyHelper.degreesToCardinal(effort.wind_bearing);
            effort.ride_bearing_str = geographyHelper.convertLatLongToCardinal(segmentData.end_latlng[0], // longLatToCardinal
              segmentData.end_latlng[1], segmentData.start_latlng[0], segmentData.start_latlng[1]);

            try {
              const windVector = new Vector(-Vector.getLatitudeFromBearing(effort.wind_bearing),
                -Vector.getLongitudeFromBearing(effort.wind_bearing));
              const segmentVector = new Vector(parseFloat(segmentData.latitude),
                parseFloat(segmentData.longitude));
              const roundoffValue = 1 - Vector.getDistance(windVector, segmentVector);
              const speed = Vector.resultantSpeed(parseInt(effort.wind_speed, 0));
              effort.coefficient = speed * roundoffValue;
              effort.coefficient_str = (effort.coefficient).toFixed(2);
            } catch (e) {
              console.log(e);
            }

            count += 1;
            if (count === segmentData.leaderboard.length) {
              res.render('details', segmentData);
            }
          }).fail((err) => {
            res.render('error', { message: err });
            console.log(err);
          });
        });
      }).fail((errorResponse) => {
        const errorMessage = JSON.parse(errorResponse.body);
        res.render('error', { message: errorMessage.message });
      });
    }).fail((errorResponse) => {
      const errorMessage = JSON.parse(errorResponse.body);
      res.render('error', { message: errorMessage.message });
    });
  }
});

router.get('/test', (req, res) => {
  res.send(req.isAuthenticated());
});

module.exports = router;
