var express = require('express');
var router = express.Router();
const passport = require('passport');
const requestify = require('requestify');
const handlebars = require('handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else{
    //console.log(req.user);
    //requestify.get("https://www.strava.com/api/v3/segments/" + 10112025 + "/leaderboard?&access_token=" + req.user.accessToken + "")
    //requestify.get("https://www.strava.com/api/v3/athletes/" + req.user.id + "/koms?access_token=" + req.user.accessToken)

    // step #1: Get the list of activities
    // step #2: Get the list of segments within each activity (https://www.strava.com/api/v3/activities/:id)

    let segmentIDs = new Set();
    let segments = [];
    let target = undefined;
    let count = 0;

    requestify.get("https://www.strava.com/api/v3/athlete/activities?access_token=" + req.user.accessToken).then(response => {
        let activities = JSON.parse(response.body);
        target = activities.length;
        activities.forEach(activity => { // activity.name, activity.id
          requestify.get("https://www.strava.com/api/v3/activities/" + activity.id + "?access_token=" + req.user.accessToken).then(activityDetailsResponse => {
            let activityDetails = JSON.parse(activityDetailsResponse.body);
            activityDetails.segment_efforts.forEach(segment => {
              let pr_rank = segment.pr_rank;
              segment = segment.segment;
              if (!segmentIDs.has(segment.id) && !segmentIDs.has(segment.name)){
                segmentIDs.add(segment.id);
                segmentIDs.add(segment.name);
                
                segments.push({name: segment.name, id: segment.id, distance: (segment.distance/1000).toFixed(2), average_grade: segment.average_grade, maximum_grade: segment.maximum_grade, ranking: pr_rank, city: segment.city, province: segment.state, country: segment.country});
              }
            });
            count++;
            if (count == target){
              let data = {};
              data.segments = segments;
              res.render('segments', data);
            }
          });
        })
    });
    // Async
  }
});

router.get('/details', (req, res, next) => {
  if (!req.isAuthenticated()){
    res.redirect('/');
  }
  else if (req.query.id == undefined){
    res.render('error', {message: "No supplied segment id!"});
  }
  else{
    let leaderboard = [];
    let segmentID = req.query.id;
    requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "/leaderboard?&access_token=" + req.user.accessToken).then(response => {
        const leaderboardResponse = JSON.parse(response.body);
        leaderboardResponse.entries.forEach(effort => {
          leaderboard.push(effort);
        });

        // Get segment information
        requestify.get("https://www.strava.com/api/v3/segments/" + segmentID + "?&access_token=" + req.user.accessToken).then(segmentResponse => {
          let segmentDetails = JSON.parse(segmentResponse.body);
          let segmentData = segmentDetails; // ?? 
          segmentData.distance /= 1000;
          segmentData.distance = segmentData.distance.toFixed(2);
          segmentData.leaderboard = leaderboard;
          segmentData.participants = leaderboardResponse.entry_count;
          segmentData.leaderboardLink = "https://www.strava.com/segments/" + segmentID + "?filter=overall";
          segmentData.latitude = segmentData.start_latlng[0];
          segmentData.longitude = segmentData.start_latlng[1];
          let polyline = "";
          for(var x = 0; x < segmentData.map.polyline.length; x++){
            if (segmentData.map.polyline.charAt(x) != '\\'){
              polyline += segmentData.map.polyline.charAt(x);
            }
            else{
              polyline += '\\' + segmentData.map.polyline.charAt(x);
            }
          }
          segmentData.map.polyline = polyline;

          console.log(segmentData.map.polyline);

          segmentData.leaderboard.forEach(effort => {
            effort.start_date = effort.start_date.substring(0, 10);
            effort.rank = effort.rank + ((effort.rank % 10 == 1) ? ("st") : (effort.rank % 10 == 2) ? ("nd") : (effort.rank % 10 == 3) ? "rd" : "th");
            effort.speed = (((effort.distance * 3.6) / effort.elapsed_time).toFixed(2)) + "km/h";
          });

          res.render('details', segmentData);

        }).fail(errorResponse => {
          let errorMessage = JSON.parse(errorResponse.body);
          res.render('error', {message: errorMessage.message});
        });
    }).fail(errorResponse => {
      let errorMessage = JSON.parse(errorResponse.body);
      res.render('error', {message: errorMessage.message});
    });
  }
});

module.exports = router;